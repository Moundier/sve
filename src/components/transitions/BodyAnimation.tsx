import { useRef } from 'react';
import { SwitchTransition, Transition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap-trial'

const BodyAnimationComponent = ({ children }: any) => {
  
  const loc = useLocation();
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const duration = {
    in: 0.25, // 0.25
    out: 0.20, // 0.20
  }

  return (
    <SwitchTransition>
      <Transition
        key={loc.pathname}
        timeout={500}
        nodeRef={nodeRef}
        onEnter={() => {
          let node: HTMLDivElement | null = nodeRef.current;
          if (node) {
            gsap.set(node, { autoAlpha: 0, scale: 0.8, xPercent: -100 });
            gsap.timeline({ paused: true })
            .to(node, { autoAlpha: 1, xPercent: 0, duration: duration.in })
            .to(node, { scale: 1, duration: duration.in })
            .play();
            return;
          }
          return console.warn('GSAP target not found');
        }}
        onExit={() => {
          let node: HTMLDivElement | null = nodeRef.current;
          if (node) {
            gsap.timeline({ paused: true })
            .to(node, { scale: 0.8, duration: duration.out })
            .to(node, { xPercent: 100, autoAlpha: 0, duration: duration.out })
            .play();
            return;
          }
          return console.warn('GSAP target not found');
        }}
      >
        <div ref={nodeRef} className="w-full h-full flex flex-col relative flex-grow">
          {children}
        </div>
      </Transition>
    </SwitchTransition>
  );
};

export default BodyAnimationComponent;
