// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Subscription Management
/// @author xh3b4sd
/// @notice Subscription is a fee deducting payment splitter.
/// @notice All payment interactions are peer-to-peer.
/// @notice User funds are never custodied inside the contract.
contract Subscription is Ownable {
    ///
    /// VARIABLES
    ///

    /// @notice _feeadd is the address receiving all deducted service fees.
    address private _feeadd;
    /// @notice _feeamn is the service fee in basis points, e.g. 100 == 1%.
    uint256 private _feeamn;
    /// @notice _subamn is the amount of ETH paid in wei for a subscription.
    uint256 private _subamn;

    /// @notice _subunx is the mapping for paid subscriptions per interval.
    /// @notice The interval here is expressed in unix seconds, e.g. 1698793200.
    /// @notice The interval here is the start of any given month.
    mapping(address => uint256) private _subunx;

    ///
    /// EVENTS
    ///

    /// @notice SetFeeAdd TODO
    event SetFeeAdd(address feeadd);

    /// @notice SetFeeAmn TODO
    event SetFeeAmn(uint256 feeamn);

    /// @notice SetSubAmn TODO
    event SetSubAmn(uint256 subamn);

    ///
    /// CONSTRUCTOR
    ///

    /// @notice constructor for initializing an instance of the Subscription contract.
    /// @param ownadd the initial owner address.
    constructor(address ownadd) Ownable(ownadd) {
        _feeadd = ownadd;
        _feeamn = 1000; // 1000 == 10%
        _subamn = 3000000000000000; // 0.003 ETH == 6$ at 2000$ per ETH
    }

    ///
    /// EXTERNAL
    ///

    /// @notice subOne TODO
    function subOne(address creator, uint256 unixsec) external payable {
        // Verify the given input.
        require(creator != address(0), "creator address must not be zero");
        require(_subamn == msg.value, "subscription amount must match");

        // Calculate the service fee.
        uint256 srvfee = feeAmn(msg.value);

        // Calculate the amount received by the creator.
        uint256 creamn = msg.value - srvfee;

        // Transfer funds.
        payable(_feeadd).transfer(srvfee);
        payable(creator).transfer(creamn);

        // Track the unix timestamp for this subscription.
        _subunx[msg.sender] = unixsec;
    }

    /// @notice subTwo TODO
    function subTwo(
        address creaone,
        uint256 amntone,
        address creatwo,
        uint256 amnttwo,
        uint256 unixsec
    ) external payable {
        // Verify the given input.
        require(creaone != address(0), "creator address must not be zero");
        require(creatwo != address(0), "creator address must not be zero");
        require(amntone != 0, "creator amount must not be zero");
        require(amnttwo != 0, "creator amount must not be zero");
        require(amntone + amnttwo == 100, "creator amount must add up to 100");
        require(_subamn == msg.value, "subscription amount must match");

        // Calculate the service fee.
        uint256 srvfee = feeAmn(msg.value);

        // Calculate the amount received by the creator.
        uint256 allamn = msg.value - srvfee;
        uint256 oneamn = (allamn * amntone) / 100;
        uint256 twoamn = (allamn * amnttwo) / 100;

        // Transfer funds.
        payable(_feeadd).transfer(srvfee);
        payable(creaone).transfer(oneamn);
        payable(creatwo).transfer(twoamn);

        // Track the unix timestamp for this subscription.
        _subunx[msg.sender] = unixsec;
    }

    /// @notice subThr TODO
    function subThr(
        address creaone,
        uint256 amntone,
        address creatwo,
        uint256 amnttwo,
        address creathr,
        uint256 amntthr,
        uint256 unixsec
    ) external payable {
        // Verify the given input.
        require(creaone != address(0), "creator address must not be zero");
        require(creatwo != address(0), "creator address must not be zero");
        require(amntone != 0, "creator amount must not be zero");
        require(amnttwo != 0, "creator amount must not be zero");
        require(amntthr != 0, "creator amount must not be zero");
        require(
            amntone + amnttwo + amntthr == 100,
            "creator amount must add up to 100"
        );
        require(_subamn == msg.value, "subscription amount must match");

        // Calculate the service fee.
        uint256 srvfee = feeAmn(msg.value);

        // Calculate the amount received by the creator.
        uint256 rstamn = msg.value - srvfee;
        uint256 oneamn = (rstamn * amntone) / 100;
        uint256 twoamn = (rstamn * amnttwo) / 100;
        uint256 thramn = (rstamn * amntthr) / 100;

        // Transfer funds.
        payable(_feeadd).transfer(srvfee);
        payable(creaone).transfer(oneamn);
        payable(creatwo).transfer(twoamn);
        payable(creathr).transfer(thramn);

        // Track the unix timestamp for this subscription.
        _subunx[msg.sender] = unixsec;
    }

    ///
    /// VIEW
    ///

    /// @notice getFeeAdd returns the address receiving all deducted service fees.
    function getFeeAdd() external view returns (address) {
        return _feeadd;
    }

    /// @notice getFeeAmn returns the service fee in basis points, e.g. 100 == 1%.
    function getFeeAmn() external view returns (uint256) {
        return _feeamn;
    }

    /// @notice getSubAmn returns the amount of ETH paid in wei for a subscription.
    function getSubAmn() external view returns (uint256) {
        return _subamn;
    }

    ///
    /// INTERNAL
    ///

    /// @notice feeAmn TODO
    function feeAmn(uint256 amount) internal view returns (uint256) {
        return (amount * _feeamn) / 10000;
    }

    ///
    /// OWNER
    ///

    /// @notice setFeeAdd TODO
    function setFeeAdd(address feeadd) external onlyOwner {
        require(feeadd != address(0), "fee address must not be zero");

        _feeadd = feeadd;

        emit SetFeeAdd(feeadd);
    }

    /// @notice setFeeAmn TODO
    function setFeeAmn(uint256 feeamn) external onlyOwner {
        require(feeamn >= 100, "fee amount must be >= 1%");
        require(feeamn <= 5000, "fee amount must be <= 50%");

        _feeamn = feeamn;

        emit SetFeeAmn(feeamn);
    }

    /// @notice setSubAmn TODO
    function setSubAmn(uint256 subamn) external onlyOwner {
        require(subamn != 0, "subscription amount must not be empty");

        _subamn = subamn;

        emit SetSubAmn(subamn);
    }

    ///
    /// BUILTIN
    ///

    /// @notice fallback TODO
    fallback() external payable {
        revert("not implemented");
    }

    /// @notice receive TODO
    receive() external payable {
        revert("not implemented");
    }
}
