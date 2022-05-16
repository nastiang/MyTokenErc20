import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("totalSupply", "Total supply of ERC-20 token")
  .addParam("token", "Token address")
  .setAction(async (taskArgs, hre) => {
    const myToken = await hre.ethers.getContractFactory("MyTokenERC20")
    const token = myToken.attach(taskArgs.token)
    const [minter] = await hre.ethers.getSigners();
    const totalSupply = (await (await token.connect(minter)).totalSupply()).toNumber()
    console.log(`Total Supply is ${totalSupply}`);
  });

task("transfer", "ERC-20 transfer")
  .addParam("token", "Token address")
  .addParam("spender", "Spender address")
  .addParam("amount", "Token amount")
  .setAction(async (taskArgs, hre) => {
    const myToken = await hre.ethers.getContractFactory("MyTokenERC20")
    const token = myToken.attach(taskArgs.token)
    const [minter] = await hre.ethers.getSigners();
    await (await token.connect(minter).transfer(taskArgs.spender, taskArgs.amount)).wait()
    console.log(`${minter.address} has transferred ${taskArgs.amount} to ${taskArgs.spender}`);
  });

task("balanceOf", "Total supply of ERC-20 token")
  .addParam("token", "Token address")
  .addParam("account", "Account address")
  .setAction(async (taskArgs, hre) => {
    const myToken = await hre.ethers.getContractFactory("MyTokenERC20")
    const token = myToken.attach(taskArgs.token)
    const [minter] = await hre.ethers.getSigners();
    const balance = (await (await token.connect(minter)).balanceOf(taskArgs.account)).toNumber()
    console.log(`Account ${taskArgs.account} has a total token balance:  ${balance} WTM`);
  });

  task("approve", "ERC-20 approve")
    .addParam("token", "Token address")
    .addParam("spender", "Spender address")
    .addParam("amount", "Token amount")
    .setAction(async (taskArgs, hre) => {
       const myToken = await hre.ethers.getContractFactory("MyTokenERC20")
       const token = myToken.attach(taskArgs.token)
        const [sender] = await hre.ethers.getSigners();
        await (await token.connect(sender).approve(taskArgs.spender, taskArgs.amount)).wait()
        console.log(`${sender.address} has approved ${taskArgs.amount} tokens to ${taskArgs.spender}`);
    });

    task("transferFrom", "ERC-20 transferFrom")
    .addParam("token", "Token address")
    .addParam("sender", "Sender address")
    .addParam("amount", "Token amount")
    .setAction(async (taskArgs, hre) => {
        const myToken = await hre.ethers.getContractFactory("MyTokenERC20")
        const token = myToken.attach(taskArgs.token)
        const [recipient] = await hre.ethers.getSigners()
        console.log(recipient.address);
        await (await token.connect(recipient).transferFrom(taskArgs.sender, recipient.address, taskArgs.amount)).wait()
        console.log(`${recipient.address} has received ${taskArgs.amount} tokens from ${taskArgs.sender}`)
    });

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL,
      accounts:
        [`0x${process.env.PRIVATE_KEY}`]
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      ropsten: process.env.ETHERSCAN_API_KEY,
    }
  }

};

export default config;
