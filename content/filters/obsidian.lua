-- Strip Obsidian wikilinks, %% comments, and bare #tag lines.
-- Pandoc 3.x API: tag/content/text instead of t/c.

local function starts_with(str, prefix)
  return str:sub(1, #prefix) == prefix
end

local function ends_with(str, suffix)
  return str:sub(-#suffix) == suffix
end

-- State for multi-word wikilinks and %% comments
local wiki_mode = false
local wiki_has_pipe = false
local wiki_pipe_text = ""
local wiki_buffer = {}
local in_comment = false

local function flush_wiki(result)
  if wiki_mode and #wiki_buffer > 0 then
    if wiki_has_pipe then
      table.insert(result, pandoc.Str(wiki_pipe_text))
    else
      table.insert(result, pandoc.Str(table.concat(wiki_buffer, " ")))
    end
  end
  wiki_mode = false
  wiki_has_pipe = false
  wiki_buffer = {}
  wiki_pipe_text = ""
end

-- Process a Str element's text for wikilinks, comments, tags.
-- Returns true if consumed (should not be added to result).
local function process_str(text, result)
  -- %% comment handling
  if starts_with(text, "%%") then
    local rest = text:sub(3)
    if in_comment then
      in_comment = false
      return true
    else
      in_comment = true
      local close = rest:find("%%")
      if close then
        in_comment = false
        local after = rest:sub(close + 2)
        if after ~= "" then
          return process_str(after, result)
        end
      end
      return true
    end
  end

  if in_comment then
    if ends_with(text, "%%") then
      in_comment = false
    end
    return true
  end

  -- [[wikilink]] handling
  if starts_with(text, "[[") then
    local content = text:sub(3)
    local close = content:find("]]")
    if close then
      local inner = content:sub(1, close - 1)
      local pipe = inner:find("|")
      if pipe then
        table.insert(result, pandoc.Str(inner:sub(pipe + 1)))
      else
        table.insert(result, pandoc.Str(inner))
      end
      local after = content:sub(close + 2)
      if after ~= "" then
        return process_str(after, result)
      end
      return true
    else
      local pipe = content:find("|")
      if pipe then
        wiki_has_pipe = true
        wiki_pipe_text = content:sub(pipe + 1)
      else
        wiki_buffer = { content }
      end
      wiki_mode = true
      return true
    end
  end

  if wiki_mode then
    local close = text:find("]]")
    if close then
      local before = text:sub(1, close - 1)
      table.insert(wiki_buffer, before)
      if wiki_has_pipe then
        table.insert(result, pandoc.Str(wiki_pipe_text))
      else
        table.insert(result, pandoc.Str(table.concat(wiki_buffer, " ")))
      end
      wiki_mode = false
      wiki_has_pipe = false
      wiki_buffer = {}
      local after = text:sub(close + 2)
      if after ~= "" then
        return process_str(after, result)
      end
      return true
    else
      table.insert(wiki_buffer, text)
      return true
    end
  end

  -- Strip standalone #tags
  if text:match("^#[%w/]+$") then
    return true
  end

  return false
end

--- Process a list of Inline elements (Pandoc 3.x userdata).
local function process_inlines(inlines)
  local result = {}
  for _, il in ipairs(inlines) do
    if il.tag == "Str" then
      local consumed = process_str(il.text, result)
      if not consumed then
        flush_wiki(result)
        table.insert(result, il)
      end
    elseif il.tag == "Space" then
      if in_comment then
        -- skip
      elseif wiki_mode then
        -- space inside wikilink, just separator
      else
        flush_wiki(result)
        table.insert(result, il)
      end
    elseif il.tag == "SoftBreak" then
      if in_comment then
        -- skip
      else
        flush_wiki(result)
        table.insert(result, il)
      end
    else
      flush_wiki(result)
      table.insert(result, il)
    end
  end
  flush_wiki(result)
  return result
end

-- Drop metadata lines
function Para(el)
  local text = ""
  for _, il in ipairs(el.content) do
    if il.tag == "Str" then
      text = text .. il.text
    elseif il.tag == "Space" then
      text = text .. " "
    elseif il.tag == "SoftBreak" then
      text = text .. "\n"
    end
  end
  if starts_with(text, "Tags:") then return {} end
  if starts_with(text, "Refs:") then return {} end
  if text:match("^#[%w/]+") then return {} end

  el.content = process_inlines(el.content)
  return el
end

function Plain(el)
  el.content = process_inlines(el.content)
  return el
end
