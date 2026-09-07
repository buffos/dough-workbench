SHELL := pwsh.exe
.SHELLFLAGS := -NoProfile -Command

.DEFAULT_GOAL := help

BASE_PATH ?= /website-doughs

null  :=
space := $(null) #

.PHONY: help info install dev preview lint typecheck test build check-static verify gates check pages-verify clean

help:
	@$(info )
	@$(info Available make commands)
	@$(info =======================)
	@$(info )
	@$(info General:)
	@$(info $(space)$(space)help              List all available make commands)
	@$(info $(space)$(space)info              Alias of help)
	@$(info $(space)$(space)install           Install dependencies from package-lock.json)
	@$(info $(space)$(space)verify            Run tests, lint, typecheck, build and static checks)
	@$(info $(space)$(space)gates             Alias of verify)
	@$(info $(space)$(space)check             Alias of verify)
	@$(info )
	@$(info Quality:)
	@$(info $(space)$(space)lint              Run ESLint over the repository)
	@$(info $(space)$(space)typecheck         Run TypeScript in no-emit mode)
	@$(info $(space)$(space)test              Run Vitest)
	@$(info $(space)$(space)check-static      Verify the generated static site structure)
	@$(info )
	@$(info Build / run:)
	@$(info $(space)$(space)dev               Start the Astro development server)
	@$(info $(space)$(space)preview           Preview the production build locally)
	@$(info $(space)$(space)build             Build the Astro static site)
	@$(info $(space)$(space)pages-verify      Verify a GitHub Pages build; override BASE_PATH when needed)
	@$(info )
	@$(info Cleanup:)
	@$(info $(space)$(space)clean             Remove generated dist and .astro output)

info: help

install:
	npm ci

dev:
	npm run dev

preview:
	npm run preview

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	npm test

build:
	npm run build

check-static:
	npm run check:static

verify:
	npm run verify

gates: verify

check: verify

pages-verify:
	$$env:BASE_PATH = '$(BASE_PATH)'; npm run verify

clean:
	if (Test-Path -LiteralPath 'dist') { Remove-Item -LiteralPath 'dist' -Recurse -Force }
	if (Test-Path -LiteralPath '.astro') { Remove-Item -LiteralPath '.astro' -Recurse -Force }
