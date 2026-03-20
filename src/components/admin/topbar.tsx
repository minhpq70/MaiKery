import { User, Bell } from "lucide-react";

export function Topbar() {
  return (
    <div className="bg-white h-16 border-b border-[#E5D5C5] flex items-center justify-between px-6">
      <div className="flex-1"></div>
      <div className="flex items-center gap-4 text-[#5C4D43]">
        <button className="hover:text-[#D96C4E] transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="h-6 w-px bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F2E8D9] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-[#8C3D2B]" />
          </div>
          <span className="text-sm font-medium">Quản trị viên</span>
        </div>
      </div>
    </div>
  );
}
