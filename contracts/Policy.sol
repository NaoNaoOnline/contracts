// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "./Triple.sol";

/// @title Policy Management
/// @author xh3b4sd
/// @notice Policy is a contextual RBAC manager.
/// @notice Permissions are expressed in SMAs (system-member-access) groups.
/// @notice System refers to context or resource.
/// @notice Member refers to account or user.
/// @notice Access refers to permission or level.
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

    /// @notice TODO
    Triple.States private _states;

    ///
    /// CONSTRUCTOR
    ///

    /// @notice TODO
    constructor() {
        _states._createRecord(Triple.Record({sys: 0, mem: msg.sender, acc: 0}));
    }

    ///
    /// PUBLIC
    ///

    /// @notice TODO
    function createRecord(Triple.Record memory rec) public {
        if (!_verifyCreate(rec)) {
            revert();
        }

        {
            _states._createRecord(rec);
            emit Created(rec.sys, rec.mem, rec.acc);
        }
    }

    /// @notice TODO
    function deleteRecord(Triple.Record memory rec) public {
        if (!_verifyDelete(rec)) {
            revert();
        }

        {
            _states._deleteRecord(rec);
            emit Deleted(rec.sys, rec.mem, rec.acc);
        }
    }

    ///
    /// VIEW
    ///

    /// @notice TODO
    function searchRecord() public view returns (Triple.Record[] memory) {
        return _states._searchRecord();
    }

    ///
    /// INTERNAL
    ///

    /// @notice TODO
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

        // Creating a new system. Only access zero in system zero can create a
        // new system.
        //
        //     The system to be created must not already exist.
        //     The caller must have access zero in system zero.
        //     The member to be added must become access zero.
        //
        if (!dse && czz && maz) {
            return true;
        }

        // Adding a new member to an existing system. Anyone in any given system
        // can add anyone to that system with equal or lower access.
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

        return false;
    }

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

        // oom, only one member, expresses whether the given system has only one
        // member.
        bool oom = _states._searchMember(rec.sys) == 1;

        // Anyone can remove themselves.
        //
        //     The record to remove must exist as given.
        //     The caller must not have access zero in system zero.
        //     The caller must remove themselves.
        //
        if (dre && !czz && cim) {
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

        // Access zero in system zero can remove themselves.
        //
        //     The record to remove must exist as given.
        //     The system to remove the member from must exist.
        //     The member to remove must exist in that system.
        //     The caller must have access zero in system zero.
        //     The caller must be the last member in that system.
        //     The system to remove the member from must not be system zero.
        //     The caller must remove themselves.
        //
        if (dre && dse && dme && czz && oom && rec.sys != 0 && cim) {
            return true;
        }

        return false;
    }
}
