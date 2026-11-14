from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "Blue_Ocean_Kopi_PRD_Pitch.pdf"
HERO_IMAGE = ROOT / "public" / "images" / "kopi-site-reference.png"

PALETTE = {
    "ocean": colors.HexColor("#326f7b"),
    "ocean_light": colors.HexColor("#dcebed"),
    "leaf": colors.HexColor("#31533d"),
    "grey": colors.HexColor("#eef1ef"),
    "ink": colors.HexColor("#1f2933"),
    "muted": colors.HexColor("#657883"),
}


def stylesheet():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="TitleHero",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=28,
            leading=32,
            textColor=PALETTE["ink"],
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionTitle",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=PALETTE["ocean"],
            spaceBefore=14,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyPitch",
            parent=styles["BodyText"],
            fontSize=10.5,
            leading=15,
            textColor=PALETTE["ink"],
            spaceAfter=7,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SmallMuted",
            parent=styles["BodyText"],
            fontSize=8.5,
            leading=11,
            textColor=PALETTE["muted"],
        )
    )
    return styles


def p(text, style):
    return Paragraph(text, style)


def section(title, body, styles):
    items = [p(title, styles["SectionTitle"])]
    for paragraph in body:
        items.append(p(paragraph, styles["BodyPitch"]))
    return KeepTogether(items)


def make_table(rows, col_widths):
    cell_style = ParagraphStyle(
        name="TableCell",
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=PALETTE["ink"],
    )
    head_style = ParagraphStyle(
        name="TableHead",
        parent=cell_style,
        fontName="Helvetica-Bold",
        textColor=colors.white,
    )
    wrapped_rows = []
    for row_index, row in enumerate(rows):
        style = head_style if row_index == 0 else cell_style
        wrapped_rows.append([Paragraph(str(cell), style) for cell in row])

    table = Table(wrapped_rows, colWidths=col_widths, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), PALETTE["ocean"]),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#b8c8c9")),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def build_pdf():
    styles = stylesheet()
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
        title="Blue Ocean Kopi & Co. PRD Pitch",
        author="Blue Ocean Kopi & Co.",
    )

    story = [
        p("Blue Ocean Kopi & Co.", styles["TitleHero"]),
        p("Product Requirements Document - Pitch Version", styles["SectionTitle"]),
        p(
            "A warm, modern single-page website for a neighbourhood plant-based cafe at YKK Street in Singapore.",
            styles["BodyPitch"],
        ),
    ]

    if HERO_IMAGE.exists():
        story.extend([Spacer(1, 7), Image(str(HERO_IMAGE), width=160 * mm, height=90 * mm), Spacer(1, 8)])

    story.extend(
        [
            section(
                "1. Executive Summary",
                [
                    "Blue Ocean Kopi & Co. needs a public website that quickly communicates its cafe identity, plant-based menu direction, location, and opening hours.",
                    "The first release focuses on a polished single-page experience built with Vite, React and Tailwind CSS, matching the course requirement and giving the business a foundation for future pages.",
                ],
                styles,
            ),
            section(
                "2. Product Goals",
                [
                    "Present Blue Ocean Kopi & Co. as a warm, modern and approachable plant-based cafe.",
                    "Help customers understand what the cafe serves before visiting.",
                    "Make the YKK Street location and opening hours easy to find.",
                    "Create a clean codebase that can later expand into ordering, bookings or loyalty features.",
                ],
                styles,
            ),
            section(
                "3. Target Users",
                [
                    "<b>Nearby office workers:</b> want quick breakfast and lunch options with clear prices.",
                    "<b>Neighbourhood regulars:</b> want a familiar kopi stop with lighter plant-based choices.",
                    "<b>Weekend visitors:</b> want an easy cafe page with address, hours and menu highlights.",
                ],
                styles,
            ),
        ]
    )

    feature_rows = [
        ["Feature", "Description", "Pitch Value"],
        ["Main banner", "Cafe name, plant-based positioning, tagline and clear menu action.", "Fast first impression."],
        ["About Us", "Short cafe story with plant-based, slow morning and YKK Street cues.", "Builds trust and character."],
        ["Menu preview", "Signature Kopi, Kaya Toast Set and Uncle's Laksa with S$ prices.", "Answers the key customer question."],
        ["Contact Us", "YKK Street address and opening hours.", "Helps customers plan a visit."],
        ["Design reference", "Shows Vite, React and Tailwind stack alignment.", "Supports assignment pitch requirements."],
    ]
    story.extend([PageBreak(), p("4. MVP Feature Scope", styles["SectionTitle"]), make_table(feature_rows, [38 * mm, 78 * mm, 49 * mm])])

    story.extend(
        [
            section(
                "5. Design Direction",
                [
                    "The interface uses grey, light blue and green as requested. Light blue creates a calm cafe atmosphere, green signals plant-based freshness, and grey keeps the layout grounded and readable.",
                    "The hero uses a PDF-derived kopi and kaya toast image, replacing the earlier generated bitmap assets with assignment-source imagery.",
                ],
                styles,
            ),
        ]
    )

    palette_rows = [
        ["Token", "Hex", "Purpose"],
        ["Ocean 50", "#f3f8f8", "Page background"],
        ["Ocean 100", "#dcebed", "Light blue panels"],
        ["Ocean 600", "#326f7b", "Brand blue and dark section"],
        ["Leaf 700", "#31533d", "Primary action buttons"],
        ["Soft Grey", "#eef1ef", "Menu background"],
        ["Stone Blue", "#657883", "Secondary text"],
    ]
    story.extend([p("6. Page Colour Palette", styles["SectionTitle"]), make_table(palette_rows, [42 * mm, 35 * mm, 88 * mm])])

    story.append(PageBreak())
    story.extend(
        [
            section(
                "7. Technical Approach",
                [
                    "<b>Vite</b> provides the local development server and production build.",
                    "<b>React</b> organizes the page into reusable components: Header, Hero, About, MenuPreview, Contact and DesignReference.",
                    "<b>Tailwind CSS</b> handles spacing, colour, layout, responsive behaviour and typography directly in the component markup.",
                    "<b>lucide-react</b> supplies lightweight icons that match the modern UI style.",
                ],
                styles,
            ),
            section(
                "8. Success Criteria",
                [
                    "The site builds successfully with <b>pnpm build</b>.",
                    "The first screen clearly shows the cafe name, positioning and action button.",
                    "The menu preview includes the three required items and prices in Singapore dollars.",
                    "The contact section includes YKK Street and opening hours.",
                    "The design document and source code explain the tool choices and visual system.",
                ],
                styles,
            ),
            section(
                "9. Future Roadmap",
                [
                    "Phase 2: Add a full menu page and category filters.",
                    "Phase 3: Add booking and order-ahead forms.",
                    "Phase 4: Add member login, loyalty points and staff dashboard.",
                    "Phase 5: Deploy through GitHub and Vercel for public access.",
                ],
                styles,
            ),
            section(
                "10. Pitch Close",
                [
                    "Blue Ocean Kopi & Co. starts with a focused single-page website that customers can understand in seconds. It gives the cafe a credible public face now, while leaving a clean technical path for real ordering and loyalty features later.",
                ],
                styles,
            ),
            Spacer(1, 16),
            p("Prepared for the Blue Ocean Kopi & Co. Vite/React/Tailwind pitch build.", styles["SmallMuted"]),
        ]
    )

    doc.build(story)


if __name__ == "__main__":
    build_pdf()
    print(OUTPUT)
