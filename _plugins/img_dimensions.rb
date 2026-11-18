# Adds intrinsic width/height to local <img> tags at build time so the browser
# can reserve space (via CSS height:auto) before lazy images load.
require "jekyll"

module ImgDimensions
  module_function

  def size_for(path)
    data = File.binread(path, 65_536)
    case File.extname(path).downcase
    when ".png"
      data.byteslice(16, 8).unpack("NN") if data.start_with?("\x89PNG".b)
    when ".gif"
      data.byteslice(6, 4).unpack("vv")
    when ".svg"
      svg = data[/<svg\b[^>]*>/m].to_s
      w = svg[/\swidth="([\d.]+)(?:px)?"/, 1]
      h = svg[/\sheight="([\d.]+)(?:px)?"/, 1]
      return [w.to_f.round, h.to_f.round] if w && h
      vb = svg[/viewBox="([^"]+)"/, 1]
      return unless vb
      p = vb.split(/[\s,]+/).map(&:to_f)
      [p[2].round, p[3].round] if p.size == 4
    when ".jpg", ".jpeg"
      i = 2
      while i < data.bytesize - 9
        i += 1 until data.getbyte(i) == 0xFF || i >= data.bytesize - 9
        i += 1 while data.getbyte(i) == 0xFF
        m = data.getbyte(i)
        i += 1
        if (0xC0..0xCF).cover?(m) && ![0xC4, 0xC8, 0xCC].include?(m)
          h, w = data.byteslice(i + 3, 4).unpack("nn")
          return [w, h]
        end
        i += data.byteslice(i, 2).unpack1("n")
      end
      nil
    end
  rescue StandardError
    nil
  end

  def process(html, site)
    html.gsub(/<img\b[^>]*>/) do |tag|
      next tag if tag =~ /\swidth=/ || tag =~ /\sheight=/
      src = tag[/\ssrc="([^"]+)"/, 1]
      next tag unless src && src.start_with?("/") && !src.start_with?("//")
      file = File.join(site.source, src.sub(/[?#].*/, ""))
      next tag unless File.file?(file)
      w, h = size_for(file)
      next tag unless w && h && w > 0 && h > 0
      tag.sub(/\s*\/?>\z/) { |e| %( width="#{w}" height="#{h}"#{e.strip.start_with?("/") ? " /" : ""}>) }
    end
  end
end

Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  next unless doc.output_ext == ".html"
  doc.output = ImgDimensions.process(doc.output, doc.site)
end
