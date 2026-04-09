import { Leaf, Recycle, AlertTriangle } from "lucide-react";
import organicImg from "@/assets/organic-waste.jpg";
import recyclableImg from "@/assets/recyclable-waste.jpg";
import hazardousImg from "@/assets/hazardous-waste.jpg";

const categories = [
  {
    name: "Organic Waste",
    icon: Leaf,
    image: organicImg,
    color: "bg-organic",
    textColor: "text-organic",
    borderColor: "border-organic/30",
    bgLight: "bg-organic/5",
    description:
      "Biodegradable materials that decompose naturally. Composting organic waste reduces landfill methane emissions by up to 60%.",
    examples: ["Fruit & vegetable scraps", "Coffee grounds & tea bags", "Eggshells", "Leaves & garden clippings", "Food leftovers"],
    disposal:
      "Place in a compost bin or brown/green organic waste bin. Keep separate from plastics. Can be turned into nutrient-rich compost for gardens.",
  },
  {
    name: "Recyclable Waste",
    icon: Recycle,
    image: recyclableImg,
    color: "bg-recyclable",
    textColor: "text-recyclable",
    borderColor: "border-recyclable/30",
    bgLight: "bg-recyclable/5",
    description:
      "Materials that can be reprocessed into new products. Recycling one ton of paper saves 17 trees and 7,000 gallons of water.",
    examples: ["Plastic bottles & containers", "Paper & cardboard", "Aluminum & tin cans", "Glass jars & bottles", "Newspapers & magazines"],
    disposal:
      "Rinse containers, flatten cardboard, and place in the blue recycling bin. Remove caps and labels when possible. Keep materials dry and clean.",
  },
  {
    name: "Hazardous Waste",
    icon: AlertTriangle,
    image: hazardousImg,
    color: "bg-hazardous",
    textColor: "text-hazardous",
    borderColor: "border-hazardous/30",
    bgLight: "bg-hazardous/5",
    description:
      "Toxic materials that pose risks to health and the environment. Improper disposal can contaminate soil and groundwater for decades.",
    examples: ["Batteries (all types)", "Electronic waste (e-waste)", "Light bulbs (CFL & fluorescent)", "Paint & chemical solvents", "Medical sharps & medications"],
    disposal:
      "Never throw in regular trash! Take to a designated hazardous waste collection facility. Many retailers accept batteries and e-waste for safe recycling.",
  },
];

export function CategoryGuide() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-2">
          Learn the Categories
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Three Types of Waste
        </h2>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
          Understanding how to sort your waste is the first step toward a cleaner planet. Here's what goes where.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className={`group rounded-2xl border-2 ${cat.borderColor} bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  width={640}
                  height={640}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                <div className={`absolute bottom-3 left-3 flex items-center gap-2 ${cat.color} text-primary-foreground px-3 py-1.5 rounded-full text-sm font-semibold`}>
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cat.description}
                </p>

                {/* Examples */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Common Examples
                  </p>
                  <ul className="space-y-1">
                    {cat.examples.map((ex) => (
                      <li key={ex} className="flex items-start gap-2 text-sm text-foreground">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${cat.color} shrink-0`} />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disposal */}
                <div className={`${cat.bgLight} rounded-lg p-3`}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    ♻️ How to Dispose
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{cat.disposal}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
