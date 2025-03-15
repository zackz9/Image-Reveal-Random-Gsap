import Lenis from "lenis";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis({
    // options
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);



  document.querySelectorAll(".img:not([data-origin])").forEach((img, index) => {
    img.setAttribute("data-origin", index % 2 === 0 ? "left" : "right");

  });
  gsap.set(".img", { scale: 0, force3D: true });

  const rows = document.querySelectorAll(".row");

  rows.forEach((row, index) => {

    const rowImages = row.querySelectorAll(".img");

    if(rowImages.length > 0) {
      row.id = `row-${index}`;


      ScrollTrigger.create({
        
        id: `scaleIn-${index}`,
        trigger:row,
        start: "top bottom",
        end: "bottom bottom-=10%",
        scrub:1,
        invalidateOnRefresh: true,
        once: true,
        scale: [0, 1],
        ease: "power3.inOut",
        onUpdate: function (self) {
          if(self.isActive) {
            const progress = self.progress;
            const easedProgress = Math.min(1, progress * 1.35);
            const scaledValue = gsap.utils.interpolate(0, 1, easedProgress);
            rowImages.forEach((img, index) => {
              gsap.set(img, { 
                scale: scaledValue,
                force3D: true,
              });
            });

            if(progress > 0.96) {
              gsap.set(rowImages, {scale: 1, force3D: true, });
            }
          }

          
        },
          
        onLeave: function() {
          gsap.set(rowImages, {scale: 1, force3D: true, });
        }
      });


      ScrollTrigger.create({
        id: `scaleOut-${index}`,
        trigger:row,
        start: "top top",
        end: "bottom top",
        pin:true,
        pinSpacing: false,
        scrub:1,
        invalidateOnRefresh: true,
        once: true,
        scale: [0, 1],
        ease: "power3.inOut",

          
        onEnter: function() {
          gsap.set(rowImages, {scale: 1, force3D: true, });
        },
        onUpdate: function (self) {
          if(self.isActive) {
            const scale = gsap.utils.interpolate(0, 1, self.progress);
            rowImages.forEach((img, index) => {
              gsap.set(img, { 
                scale: scale,
                force3D: true,
                clearProps:  self.progress === 1 ? "scale" : "",
              });
            });

            // if(progress > 0.94) {
            //   gsap.set(rowImages, {scale: 1, force3D: true, });
            // }
          } else {
            const isAbove = self.scroll() < self.start;

            if(isAbove) {
              gsap.set(rowImages, {scale: 1, force3D: true, });
            }
          }

          
        },
      });

      ScrollTrigger.create({
        id: `marker-${index}`,
        trigger:row,
        scrub:1,
        start: "bottom bottom",
        end: "top top",
        ease: "power3.inOut",
        onEnter: function() {

          const scaleOut =ScrollTrigger.getById(`scaleOut-${index}`);
          if(scaleOut && scaleOut.progress === 0) {
            
            gsap.set(rowImages, {scale: 1, force3D: true, });
          }
        },
        onLeave: function() {

          const scaleOut =ScrollTrigger.getById(`scaleOut-${index}`);
          if(scaleOut && scaleOut.progress === 0) {
            
            gsap.set(rowImages, {scale: 1, force3D: true, });
          }
        },
       
      });
    }
  });

  window.addEventListener("resize", () => {
    ScrollTrigger.refresh(true);
  }); 
});
