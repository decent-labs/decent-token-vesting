import { network } from "hardhat"

before(async () => {
  await network.provider.send("evm_setIntervalMining", [0]);
});

after(async () => {
  await network.provider.send("evm_setIntervalMining", [[5000, 10000]]);
});
