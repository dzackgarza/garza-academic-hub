-- YouTube embed filter.
-- Usage in markdown:
--   :::{.youtube #VIDEO_ID}
--   :::
-- or:
--   :::{.youtube id="VIDEO_ID"}
--   :::
--
-- Produces a responsive 16:9 YouTube iframe embed.

local function fail(message)
  error("[youtube.lua] " .. message)
end

local function escape_html(str)
  if not str then return "" end
  str = tostring(str)
  str = str:gsub("&", "&amp;")
  str = str:gsub('"', "&quot;")
  str = str:gsub("<", "&lt;")
  str = str:gsub(">", "&gt;")
  return str
end

function Div(el)
  if not el.classes:includes("youtube") then
    return nil
  end

  -- Get video ID from identifier or id attribute
  local id = ""
  if el.identifier and el.identifier ~= "" then
    id = el.identifier
  elseif el.attributes["id"] then
    id = el.attributes["id"]
  end

  if id == "" then
    fail("youtube div requires a video ID as identifier or id attribute")
  end

  local escaped_id = escape_html(id)

  local html = [[
<div class="youtube-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 1.5em 0;">
  <iframe
    src="https://www.youtube-nocookie.com/embed/]] .. escaped_id .. [["
    title="YouTube video player"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    loading="lazy">
  </iframe>
</div>]]

  return pandoc.RawBlock("html", html)
end
