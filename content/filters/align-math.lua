function Math(el)
  if el.mathtype == pandoc.DisplayMath then
    el.text = '\\begin{align*}\n' .. el.text .. '\\end{align*}'
    return el
  end
end
