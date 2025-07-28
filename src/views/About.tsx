import { CodeBox } from "../components/common/CodeBox/CodeBox";
import VideoEditor from "../components/common/VideoEditor";

const About = () => {

  function dedent(str: string): string {
    const lines: string[] = str.split('\n');
    while (lines.length && lines[0].trim() === '') lines.shift(); // remove empty lines from the start
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop(); // remove empty lines from the end
    const identation: number[] = lines
      .filter(line => line.trim())
      .map(line => {
        const m = line.match(/^\s*/);
        return m ? m[0].length : 0;
      });
    const minIndent: number = Math.min(...identation);
    const dedented: string[] = lines.map(line => line.slice(minIndent));
    return dedented.join('\n');
  }

  const code: string = dedent(`
    const btn = document.getElementById('btn');
    let count = 0;

    function render() {
      btn.innerText = \`Count: \$\{count\}\`
    }

    btn.addEventListener('click', () => {
      // Count from 1 to 10.
      if (count < 10) {
        count += 1;
        render();
      }
    })
  `);

  return (
    <main className={`flex-grow rounded-xl m-4 bg-purple-200`}>
      <h1 className="text-4xl font-extrabold tracking-tight text-blue-900 px-6 py-6">
        The Founder of Brazil: A Journey Through History
      </h1>
      
      <article className="prose prose-blue max-w-none px-6 pb-8">
        <p>
          Brazil, the largest country in South America, has a rich and complex history shaped by indigenous cultures, 
          European explorers, and settlers. But who is considered the “founder” of Brazil? Let's 
          explore the fascinating story behind its beginnings!
        </p>

        <CodeBox code={code} />

        {/* <VideoEditor></VideoEditor> */}

        <h2 className="mt-8 mb-3 text-2xl font-semibold">Pedro Álvares Cabral: The Man Who “Discovered” Brazil</h2>

        <p>
          In 1500, Portuguese navigator <strong>Pedro Álvares Cabral</strong> led an expedition to India but accidentally landed on the coast of present-day Brazil. This event marked the first official European contact with Brazil.
        </p>

        <blockquote className="border-l-4 border-blue-400 pl-4 italic text-blue-700 my-6">
          “Discovery is always a mix of chance and preparation.” — <em>Historical saying</em>
        </blockquote>

        <p>
          While indigenous peoples had inhabited the land for thousands of years, Cabral's arrival was a turning point in Brazilian history, initiating centuries of Portuguese colonization.
        </p>

        <h2 className="mt-8 mb-3 text-2xl font-semibold">Early Colonization and the Sugarcane Economy</h2>

        <p>
          Following Cabral's landing, Portugal established settlements and began exploiting Brazil's natural resources. Sugarcane plantations quickly became the economic backbone, relying heavily on enslaved Indigenous peoples and Africans.
        </p>

        <ul className="list-disc list-inside space-y-1 text-blue-800">
          <li>1530: The beginning of systematic colonization</li>
          <li>Construction of the first forts and towns</li>
          <li>Development of the plantation economy</li>
        </ul>

        <h2 className="mt-8 mb-3 text-2xl font-semibold">A Land of Diversity and Change</h2>

        <p>
          Brazil's foundation is not a story of a single founder, but a tapestry of cultures, peoples, and events. From indigenous resilience to European influence, to African heritage — all have contributed to the country's vibrant identity.
        </p>

        <p>
          Today, Brazil stands as a testament to diversity and transformation, with a history worth exploring beyond dates and names.
        </p>

        <h2 className="mt-8 mb-3 text-2xl font-semibold">Fun Fact</h2>
        <p>
          Did you know? The name "Brazil" comes from “pau-brasil,” a type of red wood that was highly valued by early traders and gave the country its name.
        </p>

        <footer className="mt-10 pt-6 border-t border-blue-200 text-sm text-blue-600">
          Written by <strong>History Buff</strong> — July 2025
        </footer>
      </article>
    </main>
  )
};

export default About;
