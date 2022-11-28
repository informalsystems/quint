##
# TNT
#
# @file
# @version 0.1

.PHONY: vscode

vscode:
	cd tntc; npm run compile; yalc publish
	cd vscode/tnt/server; yalc add tntc
	cd vscode/tnt; npm install; npm run compile
	ln --symbolic --force vscode/tnt $(HOME)/.vscode/extensions/



# end
