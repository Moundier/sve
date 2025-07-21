
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

const theme = {
   keyword:       'text-purple-400',
   function:      'text-pink-400',
   string:        'text-blue-300',
   variable:      'text-blue-700',
   punctuation:   'text-gray-300',
   comment:       'text-green-700',
   type:          'text-emerald-300',
   number:        'text-orange-700',
   operator:      'text-pink-700',
   literal:       'text-amber-700',
   background:    'bg-gray-700',
};

const patterns: Pattern[] = [
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
      name: 'comment',
      regex: /\/\/.*|\/\*[\s\S]*?\*\//g,
      className: theme.comment
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

export const CodeViewFC: React.FC<{ code: string }> = ({ code }) => {

   let tokens = tokenize(code, patterns);

   return (
      <pre className="mx-4 bg-stone-800 text-white p-2 rounded">
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