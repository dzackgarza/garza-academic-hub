import { FileText } from "lucide-react";
import AcademicLayout from "@/components/AcademicLayout";
import SectionHeading from "@/components/SectionHeading";

const Index = () => {
  return (
    <AcademicLayout>
      {/* Bio */}
      <p className="text-base leading-relaxed mb-4">
        As of the 2024-2025 academic year, I am a 6th year graduate student at the University of Georgia working in algebraic geometry with{" "}
        <a href="https://faculty.franklin.uga.edu/valery/" target="_blank" rel="noopener noreferrer">Valery Alexeev</a>.
        {" "}I am currently thinking about KSBA and semitoroidal compactifications of moduli spaces of Enriques and Coble surfaces.
      </p>

      <div className="callout mb-6">
        You can find my CV <a href="#">here</a> and preprints of my papers on <a href="https://arxiv.org" target="_blank" rel="noopener noreferrer">Arxiv</a>.
      </div>

      {/* Research */}
      <SectionHeading id="research">Research</SectionHeading>
      <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
        <li>
          <a href="https://arxiv.org/abs/2312.03638" target="_blank" rel="noopener noreferrer">
            (arxiv 2312.03638)
          </a>{" "}
          Compact moduli of Enriques surfaces with a numerical polarization of degree 2.
          Joint work with Valery Alexeev, Phil Engel, and Luca Schaffler.
          <ul className="list-circle pl-5 mt-1">
            <li>A recent talk on this work: <a href="#">Slides (PDF)</a></li>
          </ul>
        </li>
      </ul>

      {/* Talks */}
      <SectionHeading id="talks">Talks</SectionHeading>
      <p className="text-sm text-muted-foreground mb-3">You can find more older material on the talks page.</p>
      <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
        <li>A∞-Categories, Toward a Definition of the Fukaya Category (UGA Symplectic Reading Seminar, September 2022) — <a href="#">Slides (PDF)</a></li>
        <li>Some applications of the Torelli theorem: Faltings' proof of the Mordell conjecture (UGA Reading Group, July 2022) — <a href="#">Slides (PDF)</a></li>
        <li>Annihilator of the Lefschetz Motive (MIT Talbot Workshop, June 2022) — <a href="#">Typeset Notes (PDF)</a></li>
        <li>Why Derived Geometry? (UGA GSS, February 2022) — <a href="#">Slides (PDF)</a></li>
      </ul>

      {/* Recent Notes */}
      <SectionHeading id="notes">Recent Notes</SectionHeading>
      <p className="text-sm text-muted-foreground mb-3">You can find many more notes on the writing page.</p>
      <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
        <li>All of the exercises from Hartshorne compiled into a single document: <a href="#">PDF</a></li>
        <li>K3 Surfaces (Phil Engel, Spring 2023) — <a href="#">Notes (PDF)</a>, <a href="#">Notes (HTML)</a></li>
        <li>Hochschild Homology (Tekin Karadag, Spring 2023) — <a href="#">Notes (PDF)</a>, <a href="#">Notes (HTML)</a></li>
        <li>Lie Algebras (Brian Boe, Fall 2022) — <a href="#">Notes (PDF)</a>, <a href="#">Notes (HTML)</a></li>
        <li>Moduli Spaces (Valery Alexeev, Fall 2022) — <a href="#">Notes (PDF)</a>, <a href="#">Notes (HTML)</a></li>
        <li>Proceedings from Talbot 2022: Scissors Congruence and Algebraic K-Theory (June 2022) — <a href="#">Notes (PDF)</a> (Jointly compiled with Maxine Calle)</li>
        <li>Notes for the INI workshop on mathematical physics (July 2022) — <a href="#">Notes (PDF)</a>, <a href="#">Notes (HTML)</a></li>
        <li>Notes for the ADDING conference at UGA (May 2022) — <a href="#">Notes (PDF)</a>, <a href="#">Notes (HTML)</a></li>
        <li>Arizona Winter School 2022: Automorphic Forms Beyond GL₂ (March 2022) — <a href="#">Notes (PDF)</a>, <a href="#">Notes (HTML)</a></li>
        <li>MSRI workshop on Chern-Simons and Other Topological Field Theories (November 2021) — <a href="#">Notes (PDF)</a></li>
        <li>IAS/PCMI Graduate Summer School on Motivic Homotopy — <a href="#">Notes (PDF)</a>, <a href="#">Notes (HTML)</a></li>
        <li>
          MIT Talbot Workshop: Viva Talbot!:
          <ul className="list-circle pl-5 mt-1 space-y-1">
            <li>Jeremy Hahn, "Methods and Mysteries in the Construction of Ring Spectra" — <a href="#">Notes (PDF)</a></li>
            <li>Tasos Moulinos, "Perspectives of Nonabelian Hodge Theory" — <a href="#">Notes (PDF)</a></li>
          </ul>
        </li>
      </ul>

      <div className="section-divider" />
      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
        <FileText className="w-4 h-4" /> Google Scholar Feed
      </p>
    </AcademicLayout>
  );
};

export default Index;
