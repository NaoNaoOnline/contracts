// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

/// @title Triple Data Structure
/// @author xh3b4sd
/// @notice Triple manages a list of structures, tuples of three.
/// @notice Should only be used for the Policy contract.
library Triple {
    ///
    /// TYPES
    ///

    /// @notice Record represents a single SMA recorded onchain.
    struct Record {
        uint256 sys;
        address mem;
        uint256 acc;
    }

    /// @notice States is the internal structure for state management.
    /// @notice Used to keep track of created and deleted records.
    struct States {
        // reclis is the complete list of records.
        //
        //     [
        //         {0, 0x1234, 0},
        //         {1, 0x1234, 0},
        //         {2, 0x1234, 0},
        //         {0, 0x2345, 1},
        //         {2, 0x3456, 1}
        //     ]
        //
        Record[] reclis;
        // recind tracks the index of a system-member combination within reclis.
        // Resolving a system-member relationship to the reclis index enables us
        // to delete a record, given the record itself.
        //
        //     recind[sys][mem] = ind
        //
        //     {
        //         0: {0x1234: 0, 0x2345: 3},
        //         1: {0x1234: 1},
        //         2: {0x1234: 2, 0x3456: 4}
        //     }
        //
        mapping(uint256 => mapping(address => uint256)) recind;
        // memcnt tracks the amount of members within a given system. Knowing
        // how many members a system has enables us to e.g. identify whether a
        // new system is created.
        //
        //     memcnt[sys] = len(mem)
        //
        //     {
        //         0: 2,
        //         1: 1,
        //         2: 2
        //     }
        //
        mapping(uint256 => uint256) memcnt;
        // acccnt tracks the amount of members with a specific access within a
        // given system. Knowing e.g. how many access zero members a system has
        // enables us to guarantee at least one access zero member at all times
        // inside that system.
        //
        //     acccnt[sys][acc] = len(acc)
        //
        //     {
        //         0: {0: 1, 1: 1},
        //         1: {0: 1},
        //         2: {0: 1, 1: 1}
        //     }
        //
        mapping(uint256 => mapping(uint256 => uint256)) acccnt;
    }

    ///
    /// INTERNAL
    ///

    /// @notice _createRecord adds the given record to the internal state.
    /// @notice Does not safeguard against unintended use.
    /// @notice The given record must not exist.
    function _createRecord(States storage sta, Record memory rec) internal {
        sta.reclis.push(rec);

        sta.recind[rec.sys][rec.mem] = sta.reclis.length - 1;

        sta.memcnt[rec.sys] += 1;

        sta.acccnt[rec.sys][rec.acc] += 1;
    }

    /// @notice _deleteRecord removes the given record from the internal state.
    /// @notice Does not safeguard against unintended use.
    /// @notice The given record must exist.
    function _deleteRecord(States storage sta, Record memory rec) internal {
        // The last element within the record list is moved to the position of
        // the record that we are going to remove.
        Record memory las = sta.reclis[sta.reclis.length - 1];

        // The index of the record we want to remove within the record list
        // represents the position the last record is moving into.
        uint256 ind = sta.recind[rec.sys][rec.mem];

        // The old index of the last element is set to the new position. This is
        // the position of the element we are removing. From this point forward
        // this position is occupied by the updated last element, which will not
        // be the last element anymore after the process.
        sta.recind[las.sys][las.mem] = ind;

        // The last and now moved element overwrites the record we are tasked to
        // delete.
        sta.reclis[ind] = las;

        // Popping the last element out of the record list is now safe because
        // the last element did already move to its new location. That is the
        // index of the element we were tasked to delete.
        sta.reclis.pop();

        // We cleanup the index reference of the record that got deleted.
        delete sta.recind[rec.sys][rec.mem];

        // We reduce the member count of the system from which we removed a
        // member.
        sta.memcnt[rec.sys] -= 1;

        // If the last member got deleted from a system we can cleanup the
        // system's member count reference.
        if (sta.memcnt[rec.sys] == 0) {
            delete sta.memcnt[rec.sys];
        }

        // We reduce the access count for the system from which we removed a
        // member.
        sta.acccnt[rec.sys][rec.acc] -= 1;

        // If the last member got deleted from a system we can cleanup the
        // system's access count reference.
        if (sta.acccnt[rec.sys][rec.acc] == 0) {
            delete sta.acccnt[rec.sys][rec.acc];
        }
    }

    ///
    /// VIEW
    ///

    /// @notice _existsMember expresses whether the given system member combination exists.
    function _existsMember(
        States storage sta,
        uint256 sys,
        address mem
    ) internal view returns (bool) {
        Record memory exi = sta.reclis[sta.recind[sys][mem]];
        return sys == exi.sys && mem == exi.mem;
    }

    /// @notice _existsRecord expresses whether the given record exists.
    function _existsRecord(
        States storage sta,
        Record memory rec
    ) internal view returns (bool) {
        Record memory exi = sta.reclis[sta.recind[rec.sys][rec.mem]];
        return rec.sys == exi.sys && rec.mem == exi.mem && rec.acc == exi.acc;
    }

    /// @notice _existsSystem expresses whether the given system exists.
    function _existsSystem(
        States storage sta,
        uint256 sys
    ) internal view returns (bool) {
        return sta.memcnt[sys] != 0;
    }

    /// @notice _searchAccess returns the access of the member in the given system.
    /// @notice Must be used together with _existsMember.
    /// @notice Returns 0 if member does not exist.
    function _searchAccess(
        States storage sta,
        uint256 sys,
        address mem
    ) internal view returns (uint256) {
        Record memory exi = sta.reclis[sta.recind[sys][mem]];
        return exi.acc;
    }

    /// @notice _searchAccess returns the amount of members within the given system having the given access.
    /// @notice Must be used together with _existsSystem.
    /// @notice Returns 0 if system does not exist.
    function _searchAccess(
        States storage sta,
        uint256 sys,
        uint256 acc
    ) internal view returns (uint256) {
        return sta.acccnt[sys][acc];
    }

    /// @notice _searchMember returns the amount of members within the given system.
    /// @notice Must be used together with _existsSystem.
    /// @notice Returns 0 if system does not exist.
    function _searchMember(
        States storage sta,
        uint256 sys
    ) internal view returns (uint256) {
        return sta.memcnt[sys];
    }

    /// @notice _searchRecord returns all records of a cursor based iteration.
    /// @notice Iteration results span from lef to rig.
    /// @param lef the cursor to start iterating from.
    /// @param rig the cursor to end iteration at.
    /// @return don expresses whether the final list of results were returned.
    /// @return lis the list of records according to lef and rig.
    function _searchRecord(
        States storage sta,
        uint256 lef,
        uint256 rig
    ) internal view returns (bool, Record[] memory) {
        bool don = false;

        if (rig > sta.reclis.length) {
            don = true;
            rig = sta.reclis.length;
        }

        Record[] memory lis = new Record[](rig - lef);

        for (uint256 i = lef; i < rig; i++) {
            lis[i - lef] = sta.reclis[i];
        }

        return (don, lis);
    }
}
