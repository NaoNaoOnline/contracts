// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "./Triple.sol";

/// @title Policy Management
/// @author xh3b4sd
/// @notice Policy is a contextual RBAC manager.
/// @notice Permissions are expressed in SMAs (system-member-access).
/// @notice System refers to context, resource or scope.
/// @notice Member refers to account, identity or user.
/// @notice Access refers to level, permission or role.
contract Policy {
    ///
    /// EXTENSION
    ///

    using Triple for Triple.States;

    ///
    /// EVENTS
    ///

    /// @notice TODO
    event Created(
        uint256 indexed sys,
        address indexed mem,
        uint256 indexed acc
    );

    /// @notice TODO
    event Deleted(
        uint256 indexed sys,
        address indexed mem,
        uint256 indexed acc
    );

    ///
    /// TYPES
    ///

    /// @notice _amount is the maximum amount of records returned in a single call to searchRecord.
    uint256 private _amount;

    /// @notice _blocks is the block height of the last internal state change.
    uint256 private _blocks;

    /// @notice _states is the internally managed list of all Records onchain.
    Triple.States private _states;

    ///
    /// CONSTRUCTOR
    ///

    /// @notice constructor for initializing an instance of the Policy contract.
    /// @notice Creates first record for the deployer address with access zero in system zero.
    /// @notice Emits Created for the added record.
    /// @param amo the optional maximum amount of records returned in a single call to searchRecord.
    /// @param amo must be greater than 0 and smaller or equal to 1000.
    /// @param amo defaults to 100 otherwise.
    constructor(uint256 amo) {
        if (amo > 0 && amo <= 1000) {
            _amount = amo;
        } else {
            _amount = 100;
        }

        _blocks = block.number;
        _states._createRecord(Triple.Record({sys: 0, mem: msg.sender, acc: 0}));
        emit Created(0, msg.sender, 0);
    }

    ///
    /// PUBLIC
    ///

    /// @notice createRecord allows privileged members to add records onchain.
    /// @notice Reverts on unprivileged access.
    /// @notice Emits Created for the added record.
    /// @param rec the record to create.
    function createRecord(Triple.Record memory rec) public {
        if (!_verifyCreate(rec)) {
            revert();
        }

        {
            _blocks = block.number;
            _states._createRecord(rec);
            emit Created(rec.sys, rec.mem, rec.acc);
        }
    }

    /// @notice deleteRecord allows privileged members to remove records onchain.
    /// @notice Reverts on unprivileged access.
    /// @notice Emits Deleted for the removed record.
    /// @param rec the record to delete.
    function deleteRecord(Triple.Record memory rec) public {
        if (!_verifyDelete(rec)) {
            revert();
        }

        {
            _blocks = block.number;
            _states._deleteRecord(rec);
            emit Deleted(rec.sys, rec.mem, rec.acc);
        }
    }

    ///
    /// VIEW
    ///

    /// @notice searchAmount returns the maximum number of records returned with every call to searchRecord.
    function searchAmount() public view returns (uint256) {
        return _amount;
    }

    /// @notice searchBlocks returns the block height of the last state change.
    function searchBlocks() public view returns (uint256) {
        return _blocks;
    }

    /// @notice searchRecord returns all records of a cursor based iteration.
    /// @notice Iteration results span from cur to cur + _amount.
    /// @notice searchBlocks must be called before the first call to searchRecord.
    /// @notice searchBlocks must be called after the last call to searchRecord.
    /// @notice The search results are valid if the block height did not change between the first and last call to searchRecord.
    /// @notice Reverts if blo != _blocks.
    /// @param cur the cursor to start iterating from.
    /// @param blo the expected block height required to match _blocks.
    /// @return cur the new cursor for consecutive calls, or 0 if done.
    /// @return rec the list of records according to cur and _amount.
    function searchRecord(
        uint256 cur,
        uint256 blo
    ) public view returns (uint256, Triple.Record[] memory) {
        if (blo != _blocks) {
            revert();
        }

        (bool don, Triple.Record[] memory rec) = _states._searchRecord(
            cur,
            cur + _amount
        );

        if (don) {
            cur = 0;
        } else {
            cur = cur + _amount;
        }

        return (cur, rec);
    }

    ///
    /// INTERNAL
    ///

    /// @notice _verifyCreate expresses whether adding the given record is allowed.
    function _verifyCreate(
        Triple.Record memory rec
    ) internal view returns (bool) {
        // cim, caller is member, expresses whether the given member is
        // msg.sender. In this context, that means the caller adds
        // themselves.
        bool cim = rec.mem == msg.sender;

        // maz, member access zero, expresses whether the given member is
        // requested to have access zero.
        bool maz = rec.acc == 0;

        // dse, does system exist, expresses whether the given system exists.
        bool dse = _states._existsSystem(rec.sys);

        // dme, does member exist, expresses whether the given member exists in
        // the given system.
        bool dme = _states._existsMember(rec.sys, rec.mem);

        // dce, does caller exist, expresses whether the caller exists in the
        // given system.
        bool dce = _states._existsMember(rec.sys, msg.sender);

        // czz, caller zero zero, expresses whether the caller has access zero
        // in system zero.
        bool czz = _states._existsRecord(
            Triple.Record({sys: 0, mem: msg.sender, acc: 0})
        );

        // chp, caller has permission, expresses whether the caller has equal or
        // higher access. Must be used together with dce (does caller exist).
        // Otherwise msg.caller might be gaining access zero.
        bool chp = _states._searchAccess(rec.sys, msg.sender) <= rec.acc;

        // Only access zero in system zero can create a new system, for
        // themselves or others.
        //
        //     The system to be created must not already exist.
        //     The caller must have access zero in system zero.
        //     The member to be added must become access zero.
        //
        if (!dse && czz && maz) {
            return true;
        }

        // Anyone in any given system can add anyone to that system with equal
        // or lower access.
        //
        //     The system to add the member to must exist.
        //     The member to add must not already exist in that system.
        //     The caller must be in that system.
        //     The caller must have equal or higher access in that system.
        //     The caller must not add themselves.
        //
        if (dse && !dme && dce && chp && !cim) {
            return true;
        }

        // Access zero in system zero can add themselves to any given system.
        //
        //     The system to add the member to must exist.
        //     The caller must have access zero in system zero.
        //     The member to add must not already exist in that system.
        //     The caller must add themselves.
        //
        if (dse && czz && !dme && cim) {
            return true;
        }

        return false;
    }

    /// @notice _verifyDelete expresses whether removing the given record is allowed.
    function _verifyDelete(
        Triple.Record memory rec
    ) internal view returns (bool) {
        // cim, caller is member, expresses whether the given member is
        // msg.sender. In this context, that means the caller removes
        // themselves.
        bool cim = rec.mem == msg.sender;

        // dre, does record exist, expresses whether the given record exists.
        bool dre = _states._existsRecord(rec);

        // dse, does system exist, expresses whether the given system exists.
        bool dse = _states._existsSystem(rec.sys);

        // dme, does member exist, expresses whether the given member exists in
        // the given system.
        bool dme = _states._existsMember(rec.sys, rec.mem);

        // dce, does caller exist, expresses whether the caller exists in the
        // given system.
        bool dce = _states._existsMember(rec.sys, msg.sender);

        // czz, caller zero zero, expresses whether the caller has access zero
        // in system zero.
        bool czz = _states._existsRecord(
            Triple.Record({sys: 0, mem: msg.sender, acc: 0})
        );

        // chp, caller has permission, expresses whether the caller has equal or
        // higher access. Must be used together with dre (does record exist).
        // Otherwise rec.acc might be set to circumvent the callers access. Must
        // also be used together with dce (does caller exist). Otherwise
        // msg.caller might be gaining access zero.
        bool chp = _states._searchAccess(rec.sys, msg.sender) <= rec.acc;

        // maz, many access zero, expresses whether the given system to remove
        // the given member from has many access zero members. Must be used
        // together with dse (does system exist). Otherwise an empty member
        // count for the given access will be used.
        bool maz = _states._searchAccess(rec.sys, 0) > 1;

        // saz, system access zero, expresses whether the given member has
        // access zero in the given system.
        bool saz = _states._existsRecord(
            Triple.Record({sys: rec.sys, mem: rec.mem, acc: 0})
        );

        // oom, only one member, expresses whether the given system has only one
        // member.
        bool oom = _states._searchMember(rec.sys) == 1;

        // Anyone can remove themselves, if they do not have access zero.
        //
        //     The record to remove must exist as given.
        //     The caller must not have access zero in system zero.
        //     The caller must not have access zero in the given system.
        //     The caller must remove themselves.
        //
        if (dre && !czz && !saz && cim) {
            return true;
        }

        // Anyone in any given system can remove anyone from that system with
        // equal or lower access.
        //
        //     The record to remove must exist as given.
        //     The system to remove the member from must exist.
        //     The member to remove must exist in that system.
        //     The caller must exist in that system.
        //     The caller must have equal or higher access in that system.
        //     The caller must not remove themselves.
        //
        if (dre && dse && dme && dce && chp && !cim) {
            return true;
        }

        // Access zero in system zero can remove anyone.
        //
        //     The record to remove must exist as given.
        //     The system to remove the member from must exist.
        //     The member to remove must exist in that system.
        //     The caller must have access zero in system zero.
        //     The caller must not remove themselves.
        //
        if (dre && dse && dme && czz && !cim) {
            return true;
        }

        // Access zero in any given system can remove themselves from that
        // system, if that system is not system zero and delete that system in
        // the process.
        //
        //     The record to remove must exist as given.
        //     The system to remove the member from must exist.
        //     The member to remove must exist in that system.
        //     The caller must have access zero in that system.
        //     The caller must be the last member in that system.
        //     The system to remove the member from must not be system zero.
        //     The caller must remove themselves.
        //
        if (dre && dse && dme && saz && oom && rec.sys != 0 && cim) {
            // delete system
            return true;
        }

        // Access zero in any given system can be removed from that system by
        // access zero, if that system has many access zero members.
        //
        //     The record to remove must exist as given.
        //     The system to remove the member from must exist.
        //     The member to remove must exist in that system.
        //     The member to remove must have access zero in that system.
        //     The system must have many access zero members.
        //     The caller must have equal or higher access in that system.
        //
        if (dre && dse && dme && saz && maz && chp) {
            return true;
        }

        return false;
    }
}
