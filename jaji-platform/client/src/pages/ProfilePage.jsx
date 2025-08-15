import VerifiedBadge from "../components/VerifiedBadge";

// ...
<div className="flex items-center gap-2">
  <h2 className="font-bold text-xl">{profile?.displayName || "Profil"}</h2>
  {profile?.verified ? <VerifiedBadge /> : null}
</div>
