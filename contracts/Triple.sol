// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

/// @title Triple Data Structure
/// @author xh3b4sd
/// @notice TODO
library Triple {
    ///
    /// TYPES
    ///

    /// @notice TODO
    struct Record {
        uint256 sys;
        address mem;
        uint256 acc;
    }

    /// @notice TODO
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
    }

    ///
    /// INTERNAL
    ///

    /// @notice TODO
    function _createRecord(States storage sta, Record memory rec) internal {
        sta.reclis.push(rec);

        sta.recind[rec.sys][rec.mem] = sta.reclis.length - 1;

        sta.memcnt[rec.sys] += 1;
    }

    /// @notice TODO
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
        // system's count reference.
        if (sta.memcnt[rec.sys] == 0) {
            delete sta.memcnt[rec.sys];
        }
    }

    ///
    /// VIEW
    ///

    /// @notice TODO
    function _existsMember(
        States storage sta,
        uint256 sys,
        address mem
    ) internal view returns (bool) {
        Record memory exi = sta.reclis[sta.recind[sys][mem]];
        return sys == exi.sys && mem == exi.mem;
    }

    function _existsRecord(
        States storage sta,
        Record memory rec
    ) internal view returns (bool) {
        Record memory exi = sta.reclis[sta.recind[rec.sys][rec.mem]];
        return rec.sys == exi.sys && rec.mem == exi.mem && rec.acc == exi.acc;
    }

    function _existsSystem(
        States storage sta,
        uint256 sys
    ) internal view returns (bool) {
        return sta.memcnt[sys] != 0;
    }

    /// @notice TODO
    /// @notice Must be used with _existsMember.
    /// @notice Returns 0 if member does not exist.
    function _searchAccess(
        States storage sta,
        uint256 sys,
        address mem
    ) internal view returns (uint256) {
        Record memory exi = sta.reclis[sta.recind[sys][mem]];
        return exi.acc;
    }

    /// @notice TODO
    /// @notice Must be used with _existsSystem.
    /// @notice Returns 0 if system does not exist.
    function _searchMember(
        States storage sta,
        uint256 sys
    ) internal view returns (uint256) {
        return sta.memcnt[sys];
    }

    /// @notice TODO
    function _searchRecord(
        States storage sta
    ) internal view returns (Record[] memory) {
        // TODO support chunking
        return sta.reclis;
    }
}
