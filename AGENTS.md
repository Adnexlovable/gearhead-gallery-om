<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Store public shop contact details in the Contact row of site_sections.contact_details; website, booking and roadmap share this source to avoid conflicting shop information.
- Derive shop-details roadmap readiness from the saved contact fields rather than manual status changes, so missing owner information remains visible.
- Derive sitemap URLs from required per-route staticData.sitemap decisions; exclude the authenticated subtree to keep private pages out of search discovery.
- Keep database schema migrations idempotent and validate admin access through public.user_roles only, so remixes preserve existing records without email-based privilege escalation.
- Keep Search Console property details in the admin-only single-row search_console_settings table, separate from public site_sections, so monitoring notes never reach anonymous visitors.
- Submit public bookings and enquiries through server functions in src/lib/inbox.functions.ts that save the row first, then email the owner at the saved contact email; a failed email never loses the request.
