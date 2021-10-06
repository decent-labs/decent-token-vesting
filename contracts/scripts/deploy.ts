import { ethers } from "hardhat";

async function main() {
  const GeneralTokenVesting = await ethers.getContractFactory("GeneralTokenVesting");
  const generalTokenVesting = await GeneralTokenVesting.deploy();

  console.log("GeneralTokenVesting deployed to:", generalTokenVesting.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
