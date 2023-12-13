// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Subscription Management
/// @author xh3b4sd
/// @notice Subscription is a fee deducting payment splitter.
/// @notice Subscriptions have to be renewed periodically.
/// @notice Subscriptions can be verified for a certain period.
/// @notice All payment interactions are peer-to-peer.
/// @notice User funds are never custodied inside the contract.
/// @notice Subscription verification and penalty enforcement happens offchain.
/// @notice E.g. paying yourself cannot be prevented on the contract level.
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

    /// @notice _crefnd is the mapping for amount of times funded per content creator.
    /// @notice The map key here is the address of the content creator.
    /// @notice The map value here is the amount of times that subscription fees were received.
    mapping(address => uint64) private _crefnd;

    /// @notice _subcre is the mapping for creators paid per receiver.
    /// @notice The map key here is the user ID of the receiver.
    /// @notice The map value here are the paid creator addresses.
    mapping(uint64 => address[3]) private _subcre;

    /// @notice _subuni is the mapping for paid subscriptions per period.
    /// @notice The map key here is the user ID of the receiver.
    /// @notice The map value here is the subscription period.
    /// @notice The period here is expressed in unix seconds, e.g. 1696111200.
    /// @notice The period here is the start of any given month.
    mapping(uint64 => uint64) private _subuni;

    ///
    /// EVENTS
    ///

    /// @notice SetFeeAdd is emitted when the fee address changed.
    event SetFeeAdd(address feeadd);

    /// @notice SetFeeAmn is emitted when the fee amount changed.
    event SetFeeAmn(uint256 feeamn);

    /// @notice SetSubAmn is emitted when the subscription amount changed.
    event SetSubAmn(uint256 subamn);

    ///
    /// CONSTRUCTOR
    ///

    /// @notice constructor for initializing an instance of the Subscription contract.
    /// @param ownadd the initial owner address.
    constructor(address ownadd) Ownable(ownadd) {
        _feeadd = ownadd;
        _feeamn = 1000; // 1000 == 10%
        _subamn = 3e15; // 3 Finney == 0.003 ETH == 6$ at 2000$ per ETH
    }

    ///
    /// PUBLIC
    ///

    /// @notice getCreFnd returns how often the given creator got funded.
    /// @notice Returns zero if no funds were received ever.
    /// @param creator the address of the content creator to search for.
    /// @return uint64 the amount of times that subscription fees got received.
    function getCreFnd(address creator) public view returns (uint64) {
        return _crefnd[creator];
    }

    /// @notice getSubCre returns the creator addresses paid for this period.
    /// @notice Returns zero addresses if no subscription was registered ever.
    /// @param subrcvr the user ID of the receiver to search for.
    /// @return address[] the list of paid creator addresses.
    function getSubCre(uint64 subrcvr) public view returns (address[3] memory) {
        return _subcre[subrcvr];
    }

    /// @notice getSubUni returns the currently registered subscription period.
    /// @notice Returns 0 if no subscription was registered ever.
    /// @param subrcvr the user ID of the receiver to search for.
    /// @return uint64 the associated subscription period, e.g. 1696111200.
    function getSubUni(uint64 subrcvr) public view returns (uint64) {
        return _subuni[subrcvr];
    }

    ///
    /// EXTERNAL
    ///

    /// @notice subOne allows anyone to subscribe for the subscription period.
    /// @notice Subscriptions have to be renewed in advance every month.
    /// @notice Subscribing for a subscription period requires paying a fee.
    /// @notice Fees are paid to creator addresses, minus a service fee.
    /// @param subrcvr the user ID of the receiver, can differ from msg.sender.
    /// @param creaone the beneficiary creator address.
    /// @param unixsec the unix timestamp for the subscription period.
    function subOne(
        uint64 subrcvr,
        address creaone,
        uint64 unixsec
    ) external payable {
        {
            // Verify the given input.
            require(subrcvr != 0, "receiver user ID must not be zero");
            require(creaone != address(0), "creator address must not be zero");
            require(_subamn == msg.value, "subscription amount must match");

            uint64 exi = getSubUni(subrcvr);
            if (exi == 0) {
                require(unixsec > 1696111200, "unix timestamp must be current");
            } else {
                require(unixsec > exi, "unix timestamp must be current");
            }
        }

        {
            // Track the amount of times that the given content creators were
            // selected to receive the sent subscription fee. In the future this
            // will help us to acknowledge legitimate content creators onchain.
            _crefnd[creaone]++;

            // Track the paid creator addresses. The map key here tells us who
            // the receiver is and the map value here tells us which creators
            // they paid.
            _subcre[subrcvr] = [creaone];

            // Track the unix timestamp for this subscription. The map key here
            // tells us who the receiver is and the map value here tells us for
            // which period they subscribed.
            _subuni[subrcvr] = unixsec;
        }

        {
            // Calculate the service fee.
            uint256 srvfee = feeAmn(msg.value);

            // Calculate the amount received by the creator.
            uint256 creamn = msg.value - srvfee;

            // Transfer ETH.
            payable(_feeadd).transfer(srvfee);
            payable(creaone).transfer(creamn);
        }
    }

    /// @notice subTwo allows anyone to subscribe for the subscription period.
    /// @notice Subscriptions have to be renewed in advance every month.
    /// @notice Subscribing for a subscription period requires paying a fee.
    /// @notice Fees are paid to creator addresses, minus a service fee.
    /// @notice Creator amounts must add up to 100%, e.g. 75 and 25.
    /// @param subrcvr the user ID of the receiver, can differ from msg.sender.
    /// @param creaone the 1st beneficiary creator address.
    /// @param amntone the 1st beneficiary creator amount in percent, e.g. 75.
    /// @param creatwo the 2nd beneficiary creator address.
    /// @param amnttwo the 2nd beneficiary creator amount in percent, e.g. 25.
    /// @param unixsec the unix timestamp for the subscription period.
    function subTwo(
        uint64 subrcvr,
        address creaone,
        uint8 amntone,
        address creatwo,
        uint8 amnttwo,
        uint64 unixsec
    ) external payable {
        {
            // Verify the given input.
            require(subrcvr != 0, "receiver user ID must not be zero");
            require(creaone != address(0), "creator address must not be zero");
            require(creatwo != address(0), "creator address must not be zero");
            require(amntone != 0, "creator amount must not be zero");
            require(amnttwo != 0, "creator amount must not be zero");
            require(
                amntone + amnttwo == 100,
                "creator amount must add up to 100"
            );
            require(_subamn == msg.value, "subscription amount must match");

            uint64 exi = getSubUni(subrcvr);
            if (exi == 0) {
                require(unixsec > 1696111200, "unix timestamp must be current");
            } else {
                require(unixsec > exi, "unix timestamp must be current");
            }
        }

        {
            // Track the amount of times that the given content creators were
            // selected to receive the sent subscription fee. In the future this
            // will help us to acknowledge legitimate content creators onchain.
            _crefnd[creaone]++;
            _crefnd[creatwo]++;

            // Track the paid creator addresses. The map key here tells us who
            // the receiver is and the map value here tells us which creators
            // they paid.
            _subcre[subrcvr] = [creaone, creatwo];

            // Track the unix timestamp for this subscription. The map key here
            // tells us who the receiver is and the map value here tells us for
            // which period they subscribed.
            _subuni[subrcvr] = unixsec;
        }

        {
            // Calculate the service fee.
            uint256 srvfee = feeAmn(msg.value);

            // Calculate the amount received by the creator.
            uint256 allamn = msg.value - srvfee;
            uint256 oneamn = (allamn * amntone) / 100;
            uint256 twoamn = (allamn * amnttwo) / 100;

            // Transfer ETH.
            payable(_feeadd).transfer(srvfee);
            payable(creaone).transfer(oneamn);
            payable(creatwo).transfer(twoamn);
        }
    }

    /// @notice subThr allows anyone to subscribe for the subscription period.
    /// @notice Subscriptions have to be renewed in advance every month.
    /// @notice Subscribing for a subscription period requires paying a fee.
    /// @notice Fees are paid to creator addresses, minus a service fee.
    /// @notice Creator amounts must add up to 100%, e.g. 65, 30 and 5.
    /// @param subrcvr the user ID of the receiver, can differ from msg.sender.
    /// @param creaone the 1st beneficiary creator address.
    /// @param amntone the 1st beneficiary creator amount in percent, e.g. 65.
    /// @param creatwo the 2nd beneficiary creator address.
    /// @param amnttwo the 2nd beneficiary creator amount in percent, e.g. 30.
    /// @param creathr the 3rd beneficiary creator address.
    /// @param amntthr the 3rd beneficiary creator amount in percent, e.g. 5.
    /// @param unixsec the unix timestamp for the subscription period.
    function subThr(
        uint64 subrcvr,
        address creaone,
        uint8 amntone,
        address creatwo,
        uint8 amnttwo,
        address creathr,
        uint8 amntthr,
        uint64 unixsec
    ) external payable {
        {
            // Verify the given input.
            require(subrcvr != 0, "receiver user ID must not be zero");
            require(creaone != address(0), "creator address must not be zero");
            require(creatwo != address(0), "creator address must not be zero");
            require(creathr != address(0), "creator address must not be zero");
            require(amntone != 0, "creator amount must not be zero");
            require(amnttwo != 0, "creator amount must not be zero");
            require(amntthr != 0, "creator amount must not be zero");
            require(
                amntone + amnttwo + amntthr == 100,
                "creator amount must add up to 100"
            );
            require(_subamn == msg.value, "subscription amount must match");

            uint64 exi = getSubUni(subrcvr);
            if (exi == 0) {
                require(unixsec > 1696111200, "unix timestamp must be current");
            } else {
                require(unixsec > exi, "unix timestamp must be current");
            }
        }

        {
            // Track the amount of times that the given content creators were
            // selected to receive the sent subscription fee. In the future this
            // will help us to acknowledge legitimate content creators onchain.
            _crefnd[creaone]++;
            _crefnd[creatwo]++;
            _crefnd[creathr]++;

            // Track the paid creator addresses. The map key here tells us who
            // the receiver is and the map value here tells us which creators
            // they paid.
            _subcre[subrcvr] = [creaone, creatwo, creathr];

            // Track the unix timestamp for this subscription. The map key here
            // tells us who the receiver is and the map value here tells us for
            // which period they subscribed.
            _subuni[subrcvr] = unixsec;
        }

        {
            // Calculate the service fee.
            uint256 srvfee = feeAmn(msg.value);

            // Calculate the amount received by the creator.
            uint256 rstamn = msg.value - srvfee;
            uint256 oneamn = (rstamn * amntone) / 100;
            uint256 twoamn = (rstamn * amnttwo) / 100;
            uint256 thramn = (rstamn * amntthr) / 100;

            // Transfer ETH.
            payable(_feeadd).transfer(srvfee);
            payable(creaone).transfer(oneamn);
            payable(creatwo).transfer(twoamn);
            payable(creathr).transfer(thramn);
        }
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

    /// @notice feeAmn returns the basis point adjusted service fee.
    /// @param amount the msg.value to calculate the service fee from.
    function feeAmn(uint256 amount) internal view returns (uint256) {
        return (amount * _feeamn) / 10000;
    }

    ///
    /// OWNER
    ///

    /// @notice setFeeAdd allows the contract owner to change _feeadd.
    /// @param feeadd the new value for _feeadd, any but zero address.
    function setFeeAdd(address feeadd) external onlyOwner {
        require(feeadd != address(0), "fee address must not be zero");

        _feeadd = feeadd;

        emit SetFeeAdd(feeadd);
    }

    /// @notice setFeeAmn allows the contract owner to change _feeamn.
    /// @param feeamn the new value for _feeamn, between 100 and 5000.
    function setFeeAmn(uint256 feeamn) external onlyOwner {
        require(feeamn >= 100, "fee amount must be >= 1%");
        require(feeamn <= 5000, "fee amount must be <= 50%");

        _feeamn = feeamn;

        emit SetFeeAmn(feeamn);
    }

    /// @notice setSubAmn allows the contract owner to change _subamn.
    /// @param subamn the new value for _subamn, greater than 0.
    function setSubAmn(uint256 subamn) external onlyOwner {
        require(subamn != 0, "subscription amount must not be zero");

        _subamn = subamn;

        emit SetSubAmn(subamn);
    }

    ///
    /// BUILTIN
    ///

    /// @notice fallback will always revert.
    fallback() external payable {
        revert("fallback() not implemented");
    }

    /// @notice receive will always revert.
    receive() external payable {
        revert("receive() not implemented");
    }
}
