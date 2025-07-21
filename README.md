# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Generation commands:
- `npx npm install tailwindcss @tailwindcss/cli @tailwindcss/postcss autoprefixer`
- `npx npm install gsap-trial react-transition-group @types/react-transition-group`

Run the app:
- `npx npm install`
- `npx npm run dev`

Web Simple Video Editor

Aplicação web para edições simples de vídeo com Python, React e FFmpeg.

Stack
- Python (FastAPI)
- React
- Tailwind CSS
- FFmpeg
- FFprobe

Objetivos
- Upload de vídeo (MP4, WebM)
- Exibir metadados: codec, resolução, fps, canais, sample rate
- Cortar trecho por tempo (start, end)
- Redimensionar resolução
- Remover ou substituir áudio
- Alterar velocidade do vídeo
- Extrair áudio como arquivo separado
- Gerar thumbnail do vídeo
- Exportar para MP4 otimizado
- Download do vídeo editado
- Carreger / Visualizar Pack de Memes (Videos, Audios e Imagens)

Motivos
- React: mais usado no Brasil, grande comunidade.
- Tailwind: rápido para estilizar direto no JSX.
- Python (FastAPI): menos código, simples e rápido.
- FFmpeg/FFprobe: padrão robusto para editar e ler vídeos.