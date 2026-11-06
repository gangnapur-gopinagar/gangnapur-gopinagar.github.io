# Gangnapur-Gopinagar, Nadia (গাংনাপুর-গোপীনগর, নদীয়া): a community heritage website

A simple, hand-editable static website for a community history and information project covering Gangnapur, Gopinagar, and neighbouring villages in Nadia district, West Bengal. Built to run for free on GitHub Pages.

---

## What's in here

| File / folder       | What it's for                                        |
| ------------------- | ---------------------------------------------------- |
| `index.html`        | Homepage with hero, intro, and section cards         |
| `history.html`      | Long-form history page                               |
| `people.html`       | Biographical entries, organised by category          |
| `writings.html`     | Poems, stories, school magazines, historic documents |
| `geography.html`    | Land, water, climate, connectivity                   |
| `services.html`     | Schools, health, transport, government services      |
| `voter.html`        | Voter information and ECI links                      |
| `facts.html`        | Quick reference figures and dates                    |
| `interviews.html`   | Conversations with elders and notable residents      |
| `gallery.html`      | Photos and videos                                    |
| `community.html`    | Embedded Google Form for submissions                 |
| `about.html`        | Editorial credits, contact, what the site is for     |
| `css/style.css`     | The single stylesheet that controls how the site looks |
| `images/`           | Drop your photographs here                           |
| `docs/`             | Drop scanned PDFs (school magazines, documents) here |

---

## Step 1 — Try it on your own computer first

Just double-click `index.html`. It will open in your browser and you can click through every page. No server, no setup. This is the fastest way to see your edits.

---

## Step 1.5 — Add your email to the site

Once you have created your dedicated Gmail (see Step 4), find every instance of `YOUR_EMAIL_HERE@gmail.com` in the files and replace it with your real address. The placeholder appears in two places only:

- `about.html` — once in the contact paragraph
- The footer of every page (11 files)

The fastest way is a find-and-replace across the folder in any code editor (VS Code: `Ctrl+Shift+H` on Windows, `Cmd+Shift+H` on Mac).

---

## Step 2 — Editing content

All the editable spots in each page are marked with HTML comments like this:

```html
<!-- EDIT: replace the placeholder paragraphs below with your own writing -->
```

You don't need to learn HTML to edit text. Open any `.html` file in a plain text editor (TextEdit, Notepad, VS Code, or any code editor) and look for the text you want to change. Edit it. Save. Refresh your browser. That's it.

A few things to know:

- **Paragraphs** are wrapped in `<p>...</p>`
- **Section headings** use `<h2>...</h2>` or `<h3>...</h3>`
- **Bengali text** that appears alongside English uses `<span class="bangla">...</span>`. You can paste Bengali text directly into these spans.
- **To add a new person, place, or service** — find an existing `<li>...</li>` block in the relevant page, copy it, and edit the copy.

---

## Step 3 — Changing the colours or fonts

Open `css/style.css`. The first block looks like this:

```css
:root {
  --paper:      #F5EFE1;   /* main background */
  --ink:        #1B1A17;   /* primary text */
  --alta:       #A8331C;   /* primary accent — alta red */
  --peacock:    #1E5F5C;   /* secondary accent */
  ...
}
```

Change the hex colour values here and the whole site updates. Same for fonts.

---

## Step 4 — Setting up the community submission form (Google Form)

The community page expects an embedded Google Form. To set it up:

1. Go to <https://forms.google.com> and click the blank form (or use a template).
2. Add fields you want to collect. A good starter set:
   - Your name (short answer)
   - Village or place (short answer)
   - Email (short answer)
   - Type of submission (multiple choice: memory, correction, interview suggestion, notice, photograph, other)
   - Your message (paragraph)
3. Click **Send** at the top right of the form editor.
4. In the dialog, click the **`<>`** (embed HTML) tab.
5. Copy the `<iframe ...>` code Google gives you.
6. Open `community.html`. Find the line that starts with `<iframe` and ends with `</iframe>`, and replace that whole block with the iframe Google gave you.
7. Optional but recommended: in the form's **Responses** tab, click the green Sheets icon. Submissions will then flow into a Google Sheet you can review easily.

When you approve a submission, copy its content into the "Recent community notices" `<li>` block at the bottom of `community.html`.

Google Forms is free and has no monthly submission cap.

---

## Step 5 — Putting the site on GitHub Pages (free hosting)

You only need to do this once.

1. **Create a GitHub account** at <https://github.com> if you don't have one. Choose a username carefully — your site URL will include it.
2. **Create a new repository.** Two options:
   - **Option A — user site (recommended for one site):** name the repository `yourusername.github.io` exactly. Your site will live at `https://yourusername.github.io`.
   - **Option B — project site:** name the repository anything, e.g. `our-locality`. Your site will live at `https://yourusername.github.io/our-locality`.
3. **Upload the files.** On the new repo page, click "uploading an existing file" or use the green "Add file" → "Upload files" button. Drag all the files from this folder (`index.html`, `css/`, `images/`, etc.) into the upload area. Commit.
4. **Turn on Pages.** Go to your repo's **Settings** tab → **Pages** in the left menu → under "Source" pick **Deploy from a branch** → choose **main** branch and **/ (root)** folder → Save.
5. **Wait a minute.** GitHub will publish your site. You'll see the URL on the same Pages settings screen when it's ready.

After that, any time you want to update the site:
- Edit a file on GitHub directly (click the pencil icon on any file), or
- Upload a new version of the file, or
- Push from your computer if you start using Git.

The site updates automatically within a minute or two of each change.

---

## Step 6 — Adding new content gradually

A few patterns to follow as the site grows:

### To add a new person
Open `people.html`. Copy one of the `<li>...</li>` blocks under `<ul class="entry-list">`. Paste it below. Edit the dates, name, Bengali name, and description.

### To add a new photo
1. Save the photo into the `images/` folder. Use lowercase filenames with hyphens, no spaces (e.g. `rash-mela-2024.jpg`).
2. Open `gallery.html`. Find one of the `<figure class="gallery-item">` blocks.
3. Replace `<div class="placeholder">photo placeholder</div>` with `<img src="images/rash-mela-2024.jpg" alt="Description of the photo">`.
4. Update the `<figcaption>` text.

### To add a new section to the site
1. Copy any existing page file (e.g. `facts.html`) and rename it (e.g. `crafts.html`).
2. Edit the page title, the page-eyebrow, the page-title, and the content.
3. Add a `<li><a href="crafts.html">Crafts</a></li>` line into the navigation in **every** HTML file (including the new one). The nav block is at the top of each file inside `<nav class="site-nav">`.
4. Optionally add a matching card to the homepage section grid.

### To add a school magazine or historic PDF
1. Save the scanned PDF into the `docs/` folder. Use lowercase filenames with hyphens (e.g. `khirpai-school-magazine-1987.pdf`).
2. Compress the PDF first if it is larger than 5 MB. Free tools: ilovepdf.com or smallpdf.com.
3. Open `writings.html` and copy one of the existing `<li>` blocks under "School magazines."
4. Update the year, school name, description, and the `<a href="docs/your-file.pdf">` link.
5. Get permission first. Always credit the school and authors.

---

## A note on the navigation

Because this site uses plain HTML (no templating engine), the navigation menu is repeated in every page file. When you add a new page or rename one, you'll need to update the menu in each of the 10 page files. It's a small chore but it keeps the site simple and easy to host anywhere.

If you find this annoying later, the site can be migrated to **Jekyll**, which GitHub Pages supports natively and which lets you keep the header and navigation in one shared file. That's a future upgrade, not needed now.

---

## Things kept off the site by design

- **The voter list itself.** Even though electoral rolls are technically public, republishing them on a website exposes residents to scams and identity theft. The voter info page links to the Election Commission portal instead, where each person can look up only their own entry.
- **Full addresses and phone numbers** of private individuals.
- **Photographs of people without their permission**, especially children.
- **Religious or political content** that could divide the community.

The community page makes clear what is and isn't appropriate to submit.

---

## Credits

Bengali script: Noto Serif Bengali (Google Fonts).
English display: Cormorant Garamond (Google Fonts).
English body: Inter (Google Fonts).
Site design: built on plain HTML and CSS, no frameworks, no JavaScript bundlers, no build step.
