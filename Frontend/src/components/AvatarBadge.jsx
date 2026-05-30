import { avatarOptions } from "../utils/avatarOptions.js";

function AvatarBadge({ avatar = "bull", name = "User", className = "" }) {
  const option =
    avatarOptions.find((item) => item.id === avatar) || avatarOptions[0];
  const Icon = option.icon;

  return (
    <div
      className={`bg-gradient-to-br from-green-400 to-emerald-600 text-slate-950 flex items-center justify-center font-black shadow-[0_0_28px_rgba(34,197,94,0.28)] ${className}`}
      title={`${name} avatar`}
    >
      <Icon className="w-1/2 h-1/2" />
    </div>
  );
}

export default AvatarBadge;
