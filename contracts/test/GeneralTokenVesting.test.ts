import { BigNumber } from '@ethersproject/bignumber';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  GeneralTokenVesting, GeneralTokenVesting__factory,
  Mintable, Mintable__factory
} from '../typechain';
import time from './time';

describe('GeneralTokenVesting', () => {
  let owner: SignerWithAddress,
      beneficiary1: SignerWithAddress,
      beneficiary2: SignerWithAddress,
      beneficiary3: SignerWithAddress,
      recipient: SignerWithAddress;
  
  let vesting: GeneralTokenVesting,
      token1: Mintable,
      token2: Mintable,
      token3: Mintable;

  const duration1 = time.duration.years(1);
  const duration2 = time.duration.years(2);
  const duration3 = time.duration.years(3);

  const amount = BigNumber.from('1000');
  const mintAmount = BigNumber.from('20000');

  beforeEach(async function () {
    [owner, beneficiary1, beneficiary2, beneficiary3, recipient] = await ethers.getSigners();

    vesting = await new GeneralTokenVesting__factory(owner).deploy();
    token1 = await new Mintable__factory(owner).deploy();
    token2 = await new Mintable__factory(owner).deploy();
    token3 = await new Mintable__factory(owner).deploy();

    await token1.mint(owner.address, mintAmount);
    await token2.mint(owner.address, mintAmount);
    await token3.mint(owner.address, mintAmount);

    await token1.approve(vesting.address, mintAmount);
    await token2.approve(vesting.address, mintAmount);
    await token3.approve(vesting.address, mintAmount);
  });

  it('reverts with a null beneficiary', async function () {
    await expect(
      vesting.startVest(ethers.constants.AddressZero, amount, duration1, token1.address)
    ).to.be.revertedWith("GeneralTokenVesting: beneficiary is the zero address");
  });

  it('reverts with a null token', async function () {
    await expect(
      vesting.startVest(beneficiary1.address, amount, duration1, ethers.constants.AddressZero)
    ).to.be.revertedWith("GeneralTokenVesting: token is the zero address");
  });

  it('reverts with a null amount', async function () {
    await expect(
      vesting.startVest(beneficiary1.address, 0, duration1, token1.address)  
    ).to.be.revertedWith("GeneralTokenVesting: amount is zero");
  });

  it('reverts with a null duration', async function () {
    await expect(
      vesting.startVest(beneficiary1.address, amount, 0, token1.address)
    ).to.be.revertedWith("GeneralTokenVesting: duration is 0");
  });

  it('reverts with a duplicate vest', async function () {
    await vesting.startVest(beneficiary1.address, amount, duration1, token1.address);
    await expect(
      vesting.startVest(beneficiary1.address, amount, duration1, token1.address)
    ).to.be.revertedWith("GeneralTokenVesting: Vest already created for this token => beneficiary");
  });

  it('reverts with contract not approved to transfer tokens', async function () {
    await token2.approve(vesting.address, 0);
    await expect(
      vesting.startVest(beneficiary1.address, amount, duration1, token2.address)
    ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
  });

  it('reverts with contract transfing more than approved', async function () {
    await expect(
      vesting.startVest(beneficiary2.address, 30000, duration1, token1.address)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it('transfers tokens to contract address', async function () {
    await vesting.startVest(beneficiary1.address, amount, duration1, token1.address);
    expect(await token1.balanceOf(vesting.address)).to.equal(amount);
  });

  context('once vest has started', function () {
    let start: BigNumber,
        durationVest: BigNumber;

    beforeEach(async function () {
      await vesting.startVest(beneficiary1.address, amount, duration1, token1.address);
      start = await vesting.getStart(token1.address, beneficiary1.address);
      durationVest = await vesting.getDuration(token1.address, beneficiary1.address);
    });

    it('can get state', async function () {
      expect(await vesting.getTotalTokens(token1.address, beneficiary1.address)).to.equal(amount);
    });

    it('can be released', async function () {
      await time.increaseTo(start.add(durationVest).toNumber());

      await expect(vesting.release(token1.address, beneficiary1.address))
        .to.emit(vesting, 'TokensReleased')
        .withArgs(token1.address, beneficiary1.address, beneficiary1.address, amount);
    });

    it('can be releasedTo', async function () {
      await time.increaseTo(start.add(durationVest).toNumber());

      await expect(vesting.connect(beneficiary1).releaseTo(token1.address, recipient.address))
        .to.emit(vesting, 'TokensReleased')
        .withArgs(token1.address, beneficiary1.address, recipient.address, amount);
    });

    it('release reverts with beneficiary vested time is < 0', async function () {
      await expect(
        vesting.release(token1.address, beneficiary1.address)
      ).to.be.revertedWith("GeneralTokenVesting: no tokens are due");
    });

    it('releaseTo reverts with beneficiary vested time is < 0', async function () {
      await expect(
        vesting.connect(beneficiary1).releaseTo(token1.address, recipient.address)
      ).to.be.revertedWith("GeneralTokenVesting: no tokens are due");
    });

    it('release reverts with beneficiary does not exist', async function () {
      await expect(
        vesting.release(token1.address, beneficiary2.address)
      ).to.be.revertedWith("GeneralTokenVesting: no tokens are due");
    });

    it('releaseTo reverts with beneficiary does not exist', async function () {
      await expect(
        vesting.connect(beneficiary2).releaseTo(token1.address, recipient.address)
      ).to.be.revertedWith("GeneralTokenVesting: no tokens are due");
    });

    it('release reverts with token does not exist', async function () {
      await expect(
        vesting.release(token2.address, beneficiary2.address)
      ).to.be.revertedWith("GeneralTokenVesting: no tokens are due");
    });

    it('releaseTo reverts with token does not exist', async function () {
      await expect(
        vesting.connect(beneficiary2).release(token2.address, recipient.address)
      ).to.be.revertedWith("GeneralTokenVesting: no tokens are due");
    });

    it('should release proper amount', async function () {
      await time.increaseTo(start.add(duration1).toNumber());

      await vesting.release(token1.address, beneficiary1.address);
      const releaseTime = await time.latest();

      const releasedAmount = amount.mul(BigNumber.from(releaseTime).sub(start)).div(durationVest);
      expect(await token1.balanceOf(beneficiary1.address)).to.equal(releasedAmount);
      expect(await vesting.getReleasedTokens(token1.address, beneficiary1.address)).to.equal(releasedAmount);
    });

    it('release should linearly release tokens during vesting period', async function () {
      const vestingPeriod = durationVest;
      const checkpoints = 4;

      for (let i = 1; i <= checkpoints; i++) {
        const now = start.add((vestingPeriod.mul(i).div(checkpoints)));
        await time.increaseTo(now.toNumber());

        await vesting.release(token1.address, beneficiary1.address);
        const expectedVesting = amount.mul(now.sub(start)).div(durationVest);
        expect(await token1.balanceOf(beneficiary1.address)).to.equal(expectedVesting);
        expect(await vesting.getReleasedTokens(token1.address, beneficiary1.address)).to.equal(expectedVesting);
      }
    });

    it('releaseTo should linearly release tokens during vesting period', async function () {
      const vestingPeriod = durationVest;
      const checkpoints = 4;

      for (let i = 1; i <= checkpoints; i++) {
        const now = start.add((vestingPeriod.mul(i).div(checkpoints)));
        await time.increaseTo(now.toNumber());

        await vesting.connect(beneficiary1).releaseTo(token1.address, recipient.address);
        const expectedVesting = amount.mul(now.sub(start)).div(durationVest);
        expect(await token1.balanceOf(recipient.address)).to.equal(expectedVesting);
        expect(await vesting.getReleasedTokens(token1.address, beneficiary1.address)).to.equal(expectedVesting);
      }
    });

    it('should have released all after end', async function () {
      await time.increaseTo(start.add(durationVest).toNumber());
      await vesting.release(token1.address, beneficiary1.address);
      expect(await token1.balanceOf(beneficiary1.address)).to.equal(amount);
      expect(await vesting.getReleasedTokens(token1.address, beneficiary1.address)).to.equal(amount);
    });
  });

  context('multiple beneficiary/durations/tokens', function () {
    it('can get state (multiple beneficiaries)', async function () {
      await vesting.startVest(beneficiary1.address, amount, duration1, token1.address);
      await vesting.startVest(beneficiary2.address, amount, duration1, token1.address);
      await vesting.startVest(beneficiary3.address, amount, duration1, token1.address);

      // beneficiary1
      expect(await vesting.getTotalTokens(token1.address, beneficiary1.address)).to.equal(amount);
      expect(await vesting.getDuration(token1.address, beneficiary1.address)).to.equal(duration1);
      
      // beneficiary2
      expect(await vesting.getTotalTokens(token1.address, beneficiary2.address)).to.equal(amount);
      expect(await vesting.getDuration(token1.address, beneficiary2.address)).to.equal(duration1);
      
      // beneficiary3
      expect(await vesting.getTotalTokens(token1.address, beneficiary3.address)).to.equal(amount);
      expect(await vesting.getDuration(token1.address, beneficiary3.address)).to.equal(duration1);
    });

    it('can get state (multiple durations)', async function () {
      await vesting.startVest(beneficiary1.address, amount, duration1, token1.address);
      await vesting.startVest(beneficiary2.address, amount, duration2, token1.address);
      await vesting.startVest(beneficiary3.address, amount, duration3, token1.address);

      // duration1
      expect(await vesting.getTotalTokens(token1.address, beneficiary1.address)).to.equal(amount);
      expect(await vesting.getDuration(token1.address, beneficiary1.address)).to.equal(duration1);
      
      // duration2
      expect(await vesting.getTotalTokens(token1.address, beneficiary2.address)).to.equal(amount);
      expect(await vesting.getDuration(token1.address, beneficiary2.address)).to.equal(duration2);
      
      // duration3
      expect(await vesting.getTotalTokens(token1.address, beneficiary3.address)).to.equal(amount);
      expect(await vesting.getDuration(token1.address, beneficiary3.address)).to.equal(duration3);
    });

    it('can get state (multiple tokens)', async function () {
      await vesting.startVest(beneficiary1.address, amount, duration1, token1.address);
      await vesting.startVest(beneficiary1.address, amount, duration1, token2.address);
      await vesting.startVest(beneficiary1.address, amount, duration1, token3.address);

      // token1
      expect(await vesting.getTotalTokens(token1.address, beneficiary1.address)).to.equal(amount);
      expect(await vesting.getDuration(token1.address, beneficiary1.address)).to.equal(duration1);
      
      // token2
      expect(await vesting.getTotalTokens(token2.address, beneficiary1.address)).to.equal(amount);
      expect(await vesting.getDuration(token2.address, beneficiary1.address)).to.equal(duration1);
      
      // token3
      expect(await vesting.getTotalTokens(token3.address, beneficiary1.address)).to.equal(amount);
      expect(await vesting.getDuration(token3.address, beneficiary1.address)).to.equal(duration1);
    });

    it('can get state (start vests at a different time)', async function () {
      await vesting.startVest(beneficiary1.address, amount, duration1, token1.address);
      const start = await vesting.getStart(token1.address, beneficiary1.address);
      await time.increaseTo(start.add(duration1).toNumber());
      await vesting.startVest(beneficiary2.address, amount, duration1, token1.address);

      // vest1
      expect(await vesting.getTotalTokens(token1.address, beneficiary1.address)).to.equal(amount);
      expect(await vesting.getDuration(token1.address, beneficiary1.address)).to.equal(duration1);

      // vest2
      expect(await vesting.getTotalTokens(token1.address, beneficiary2.address)).to.equal(amount);
      expect(await vesting.getDuration(token1.address, beneficiary2.address)).to.equal(duration1);
    });

    it('can get state(for an address that has released tokens and started a new vest)', async function () {
      await vesting.startVest(beneficiary1.address, amount, duration1, token1.address);
      const start = await vesting.getStart(token1.address, beneficiary1.address);
      const durationVest = await vesting.getDuration(token1.address, beneficiary1.address);
      await time.increaseTo(start.add(durationVest).toNumber());
      await vesting.release(token1.address, beneficiary1.address);

      // vest with same beneficiary
      await vesting.startVest(beneficiary1.address, amount, duration1, token2.address);

      // vest1
      expect(await token1.balanceOf(beneficiary1.address)).to.equal(amount);
      expect(await vesting.getReleasedTokens(token1.address, beneficiary1.address)).to.equal(amount);
      
      // vest2
      expect(await vesting.getTotalTokens(token2.address, beneficiary1.address)).to.equal(amount);
      expect(await vesting.getDuration(token2.address, beneficiary1.address)).to.equal(duration1);
    });

    it('can get state(for an address that has releasedTo tokens and started a new vest)', async function () {
      await vesting.startVest(beneficiary1.address, amount, duration1, token1.address);
      const start = await vesting.getStart(token1.address, beneficiary1.address);
      const durationVest = await vesting.getDuration(token1.address, beneficiary1.address);
      await time.increaseTo(start.add(durationVest).toNumber());
      await vesting.connect(beneficiary1).releaseTo(token1.address, recipient.address);

      // vest with same beneficiary
      await vesting.startVest(beneficiary1.address, amount, duration1, token2.address);

      // vest1
      expect(await token1.balanceOf(recipient.address)).to.equal(amount);
      expect(await vesting.getReleasedTokens(token1.address, beneficiary1.address)).to.equal(amount);

      // vest2
      expect(await vesting.getTotalTokens(token2.address, beneficiary1.address)).to.equal(amount);
      expect(await vesting.getDuration(token2.address, beneficiary1.address)).to.equal(duration1);
    });
  });
});
