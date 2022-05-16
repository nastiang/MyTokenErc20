import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MyTokenERC20__factory, MyTokenERC20 } from "../typechain";

describe("Token contract", function () {

	let token: MyTokenERC20;
	let owner: SignerWithAddress;
	let addr1: SignerWithAddress;
	let addr2: SignerWithAddress
	let addrs: SignerWithAddress[];

	beforeEach(async function () {

		[owner, addr1, addr2, ...addrs] = await ethers.getSigners();

		const tokenFactory = (await ethers.getContractFactory(
			"MyTokenERC20", owner
		)) as MyTokenERC20__factory;
		const totalSupply = 1000
		token = await tokenFactory.deploy(totalSupply, owner.address)

	});

	describe("Deployment", function () {

		it("Should assign the total supply of tokens to the owner", async function () {
			const ownerBalance = await token.balanceOf(owner.address);
			expect(await token.totalSupply()).to.equal(ownerBalance);
		});
	});

	describe("Transactions", function () {
		it("Should transfer tokens between accounts", async function () {
			await token.transfer(addr1.address, 50);
			const addr1Balance = await token.balanceOf(addr1.address);
			expect(addr1Balance).to.equal(50);

			await token.connect(addr1).transfer(addr2.address, 50);
			const addr2Balance = await token.balanceOf(addr2.address);
			expect(addr2Balance).to.equal(50);
		});

		it("Should fail if sender doesn’t have enough tokens", async function () {
			const initialOwnerBalance = await token.balanceOf(owner.address);
			console.log("initialOwnerBalance = "+ initialOwnerBalance);

			await expect(
				token.connect(addr1).transfer(owner.address, 1)
			).to.be.reverted;

			expect(await token.balanceOf(owner.address)).to.equal(
				initialOwnerBalance
			);
		});

		it("Should update balances after transfers", async function () {
			const initialOwnerBalance = await token.balanceOf(owner.address);

			await token.transfer(addr1.address, 100);

			await token.transfer(addr2.address, 50);

			const finalOwnerBalance = await token.balanceOf(owner.address);
			expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

			const addr1Balance = await token.balanceOf(addr1.address);
			expect(addr1Balance).to.equal(100);

			const addr2Balance = await token.balanceOf(addr2.address);
			expect(addr2Balance).to.equal(50);
		});

		it("TransferFrom test", async function () {  
	
			await token.approve(addr1.address,200);
			await token.connect(addr1).transferFrom(owner.address,addr1.address,100);
			const addr1Balance = await token.balanceOf(addr1.address);
			expect(addr1Balance).to.equal(100);
		
		 });
	});

	
	  describe("Mint", function () {
	
	  it("Mint test", async () => {
		const totalSupply = await token.totalSupply();
		const expectedResult = totalSupply.add(100);
		await token.mint(owner.address,100);
		expect(await token.totalSupply()).to.equal(expectedResult);
	   
	});
	
	  });
	
	describe("Burn", function () {
	
		it("Burn test", async () => {
		  const balance = await token.balanceOf(owner.address);
		  await token.approve(owner.address,200);
		  await token.burn(owner.address,100);
		  expect(await token.balanceOf(owner.address)).to.equal(balance.sub(100));
		 
	  });
	  
		});

	describe("Allowance", function () {
	
		it("Should update allowance after approve", async () => {
			const allowance = await token.allowance(owner.address, addr1.address);
			expect(allowance).to.equal(0);
			await token.approve(addr1.address,200);

			const updatedAllowance = await token.allowance(owner.address, addr1.address);
			expect(updatedAllowance).to.equal(200);
			 
	  });
		  
		});
	
});