import fs from "fs"

const cov = JSON.parse(
    fs.readFileSync("./coverage/coverage-summary.json", {
        encoding: "utf8"
    })
)

const covPercentage = parseFloat(
    "" +
        (cov.total.lines.pct +
            cov.total.statements.pct +
            cov.total.branches.pct +
            cov.total.functions.pct) /
            4
).toFixed(0)

const badge = `
	<svg xmlns="http://www.w3.org/2000/svg" 
		xmlns:xlink="http://www.w3.org/1999/xlink" 
		width="121.25" height="28" role="img" aria-label="COVERAGE">
		<title>COVERAGE: 0</title>
		<g shape-rendering="crispEdges">
			<rect width="89" height="28" fill="#555"/>
			<rect x="89" width="32.25" height="28" fill="#4c1"/>
		</g>
		<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="100">
			<text transform="scale(.1)" x="445" y="175" textLength="650" fill="#fff">
				COVERAGE
			</text>
			<text transform="scale(.1)" x="1051.25" y="175" textLength="272.5" fill="#fff" font-weight="bold">
				${covPercentage}%
			</text>
		</g>
</svg>`

fs.writeFileSync("./badges/covbadge.svg", badge)
