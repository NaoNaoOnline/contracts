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
        // Creating a new system.
        //
        //     The system to be created must not already exist.
        //     The caller must be in system zero.
        //     The caller must have access zero in system zero.
        //     The member to be added must have access zero.
        //
        if (
            !_states._existsSystem(rec.sys) &&
            _states._existsRecord(
                Triple.Record({sys: 0, mem: msg.sender, acc: 0})
            ) &&
            rec.acc == 0
        ) {
            return true;
        }

        // Adding a new member to an existing system.
        //
        //     The system to add the member to must exist.
        //     The member to add must not already exist in that system.
        //     The caller must be in that system.
        //     The caller must have equal or higher access.
        //     The caller must not add themselves.
        //
        if (
            _states._existsSystem(rec.sys) &&
            !_states._existsMember(rec.sys, rec.mem) &&
            _states._existsMember(rec.sys, msg.sender) &&
            _states._searchAccess(rec.sys, msg.sender) <= rec.acc &&
            rec.mem != msg.sender
        ) {
            return true;
        }

        return false;
    }

    function _verifyDelete(
        Triple.Record memory rec
    ) internal view returns (bool) {
        // Removing a member from an existing system (1).
        //
        //     The record to remove must exist as given.
        //     The caller must not have access zero in system zero.
        //     The caller must remove themselves.
        //
        if (
            _states._existsRecord(rec) &&
            !_states._existsRecord(
                Triple.Record({sys: 0, mem: msg.sender, acc: 0})
            ) &&
            rec.mem == msg.sender
        ) {
            return true;
        }

        // Removing a member from an existing system (2).
        //
        //     The system to remove the member from must exist.
        //     The member to remove must exist in that system.
        //     The caller must have access zero in system zero.
        //     The caller must not remove themselves.
        //
        if (
            _states._existsSystem(rec.sys) &&
            _states._existsMember(rec.sys, rec.mem) &&
            _states._existsRecord(
                Triple.Record({sys: 0, mem: msg.sender, acc: 0})
            ) &&
            rec.mem != msg.sender
        ) {
            return true;
        }

        // Removing a member from an existing system (3).
        //
        //     The system to remove the member from must exist.
        //     The member to remove must exist in that system.
        //     The caller must have access zero in system zero.
        //     The caller must be the last member in that system.
        //     The system to remove the member from must not be system zero.
        //     The caller must remove themselves.
        //
        if (
            _states._existsSystem(rec.sys) &&
            _states._existsMember(rec.sys, rec.mem) &&
            _states._existsRecord(
                Triple.Record({sys: 0, mem: msg.sender, acc: 0})
            ) &&
            _states._searchMember(rec.sys) == 1 &&
            rec.sys != 0 &&
            rec.mem == msg.sender
        ) {
            return true;
        }

        return false;
    }
}
