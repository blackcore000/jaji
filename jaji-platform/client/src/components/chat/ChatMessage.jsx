import VerifiedBadge from "../VerifiedBadge";

// ... mesaj satırında gönderen adının yanına:
<div className="flex items-center gap-2">
  <span className="font-medium">{msg.author?.displayName || "Kullanıcı"}</span>
  {msg.author?.verified ? <VerifiedBadge /> : null}
</div>
cd C:\Users\User\Desktop\jaji\jaji-backend