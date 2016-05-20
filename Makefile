.PHONY: all
all: index.html style.css

TRANSFORM=sed \
	-e 's:^ *title .*:&\n    link(rel="stylesheet",href="./style.css"):' \
	-e '$$ s/$$/\n    script(src=".\/script.js")/'

index.html: index.pug.post
	{ pug -P < $^; echo; } > $@ || rm $@

index.pug.post: index.pug
	cat $^ > $@
	$(TRANSFORM) < $^ > $@ || rm $@

style.css: style.sass
	sass $< $@

clean:
	rm -f index.html index.pug.post style.css style.css.map
