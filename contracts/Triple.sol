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
        sta.reclis[sta.recind[rec.sys][rec.mem]] = sta.reclis[
            sta.reclis.length - 1
        ];
        sta.reclis.pop();

        delete sta.recind[rec.sys][rec.mem];

        sta.memcnt[rec.sys] -= 1;
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
    function _searchRecord(
        States storage sta
    ) internal view returns (Record[] memory) {
        return sta.reclis;
    }
}
