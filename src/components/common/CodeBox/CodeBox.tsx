
interface Token {
   type: string;
   value: string;
   className: string;
}

interface Pattern {
   name: string;
   regex: RegExp;
   className: string;
}

const themeConfig = {
   light: {
      keyword: 'text-green-700',
      function: 'text-indigo-700',
      string: 'text-emerald-700',
      variable: 'text-gray-900',
      punctuation: 'text-gray-500',
      comment: 'text-gray-500 italic',
      type: 'text-cyan-700',
      number: 'text-yellow-700',
      operator: 'text-gray-700',
      literal: 'text-orange-700',
      textColor: `#1c1919`,
      background: '#fff',
   },
   default: {
      keyword: 'text-lime-400',
      function: 'text-purple-400',
      string: 'text-green-300',
      variable: 'text-gray-800',
      punctuation: 'text-gray-50',
      comment: 'text-gray-200 italic',
      type: 'text-teal-500',
      number: 'text-yellow-400',
      operator: 'text-gray-600',
      literal: 'text-orange-600',
      textColor: `#fff`,
      background: '#1c1919',
   },
};

let theme: Record<any, string> = {
   keyword: 'text-indigo-500',
   function: 'text-blue-600',
   string: 'text-gray-200',
   variable: 'text-slate-300',
   punctuation: 'text-slate-400',
   comment: 'text-gray-500 italic',
   type: 'text-teal-400',
   number: 'text-orange-500',
   operator: 'text-slate-500',
   literal: 'text-yellow-500',
   textColor: `#fff`,
   background: 'bg-slate-900',
};

theme = themeConfig.default;

const patterns: Pattern[] = [
   {
      name: 'comment',
      regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\//g,
      className: theme.comment
   },
   {
      name: 'keyword',
      regex: /\b(const|let|var|async|await|export|import|function|return|new|if|else|for|while|switch|case|default|void)\b/g,
      className: theme.keyword
   },
   {
      name: 'function',
      regex: /\b([a-zA-Z_$][0-9a-zA-Z_$]*)(?=\()/g,
      className: theme.function
   },
   {
      name: 'string',
      regex: /(["'`])(?:(?=(\\?))\2.)*?\1/g,
      className: theme.string
   },
   {
      name: 'type',
      regex: /:\s*[A-Z][a-zA-Z0-9_$]*/g,
      className: theme.type
   },
   {
      name: 'punctuation',
      regex: /[{}()[\].,;:<>/=!&|?+-]/g,
      className: theme.punctuation
   },
   {
      name: 'number',
      regex: /\b\d+(\.\d+)?\b/g,
      className: theme.number
   },
   {
      name: 'operator',
      regex: /[=!*/%&|^~+-]+/g,
      className: theme.operator
   },
   {
      name: 'literal',
      regex: /\b(true|false|null|undefined)\b/g,
      className: theme.literal
   }
];

const tokenize = (code: string, patterns: Pattern[]): Token[] => {

   let list = [];
   let input = code;

   while (input.length > 0) {

      let found = false;
      for (const pattern of patterns) {

         pattern.regex.lastIndex = 0;
         const match = pattern.regex.exec(input);

         if (match && match.index === 0) {
            list.push({ type: pattern.name, value: match[0], className: pattern.className });
            input = input.slice(match[0].length);
            found = true;
            break;
         }
      }

      if (!found) {
         list.push({ type: 'text', value: input[0], className: '' });
         input = input.slice(1);
      }
   }

   return list;
};

export const CodeBox: React.FC<{ code: string }> = ({ code }) => {

   let tokens = tokenize(code, patterns);

   return (
      <pre style={{background: `${theme.background}`, color: `${theme.textColor}`}} className="mx-4 my-2 text-xs font-mono p-4 rounded-md  whitespace-pre overflow-x-auto">
         <code className="overflow-hidden">{
            tokens.map((token: Token, index: number) => (
               <span key={index} className={token.className}>
                  {token.value}
               </span>
            ))
         }
         </code>
      </pre>
   );
};