import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken", function () {
  it("Should return the new greeting once it's changed", async function () {
    const MyToken = await ethers.getContractFactory("MyTokenERC20");
    const token = await MyToken.deploy(10*9,'0xb3084C585795B599E45aadc0d1008E57DfB31DA8');
    await token.deployed();

   // expect(await greeter.greet()).to.equal("Hello, world!");

   // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
   // await setGreetingTx.wait();

   // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
