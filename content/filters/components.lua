-- components.lua
-- Pandoc Lua filter: converts fenced divs with class "component" into
-- data-component HTML placeholder elements for React island hydration.
--
-- Markdown syntax:
--   ::: {.component type="card-grid" filter="type=paper" columns="2"}
--   :::
--
-- Emits:
--   <div data-component="card-grid" data-filter="type=paper" data-columns="2"></div>

function Div(el)
  -- Only process divs with the "component" class
  if not el.classes:includes("component") then
    return nil
  end

  local comp_type = el.attributes["type"]
  if not comp_type then
    io.stderr:write("[components.lua] Warning: .component div missing 'type' attribute\n")
    return nil
  end

  -- Build data-* attribute string
  local parts = { 'data-component="' .. comp_type .. '"' }

  for k, v in pairs(el.attributes) do
    if k ~= "type" then
      -- Convert underscores to hyphens per HTML data attribute convention
      local attr = "data-" .. k:gsub("_", "-")
      -- Escape any double-quotes in the value
      local safe_v = v:gsub('"', "&quot;")
      table.insert(parts, attr .. '="' .. safe_v .. '"')
    end
  end

  local html = "<div " .. table.concat(parts, " ") .. "></div>"
  return pandoc.RawBlock("html", html)
end
