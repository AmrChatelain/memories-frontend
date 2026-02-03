import React from "react";

function ProfileInfo({ userInfo, onLogOut }) {
  // Safety check - don't render if userInfo is null/undefined
  if (!userInfo) {
    return null;
  }

  return (
    userInfo && (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
          {userInfo.fullName[0].toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium">{userInfo.fullName || ""}</p>

          <button
            className="text-sm text-slate-700 underline"
            onClick={onLogOut}
          >
            LogOut
          </button>
        </div>
      </div>
    )
  );
}

export default ProfileInfo;
