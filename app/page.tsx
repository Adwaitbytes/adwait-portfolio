import Hero from "./sections/Hero";
import LiveTicker from "@/components/LiveTicker";
import MarqueeBand from "./sections/MarqueeBand";
import Showcase from "./sections/Showcase";
import About from "./sections/About";
import Craft from "./sections/Craft";
import Timeline from "./sections/Timeline";
import Signals from "./sections/Signals";
import FAQ from "./sections/FAQ";
import Contact from "./sections/Contact";
import SceneDivider from "@/components/SceneDivider";
import ChapterRail from "@/components/ChapterRail";

export default function HomePage() {
  return (
    <>
      <ChapterRail />
      <Hero />
      <LiveTicker />
      <MarqueeBand />
      <SceneDivider
        index="Scene 02"
        title="SHOWCASE"
        subtitle="eleven products · eight years of late nights"
        accent="rgba(192,132,252,0.45)"
      />
      <Showcase />
      <SceneDivider
        index="Scene 03"
        title="THE OPERATOR"
        subtitle="who is writing the code"
        accent="rgba(244,211,94,0.45)"
      />
      <About />
      <SceneDivider
        index="Scene 04"
        title="THE KIT"
        subtitle="opinionated, not dogmatic"
        accent="rgba(125,211,252,0.45)"
      />
      <Craft />
      <SceneDivider
        index="Scene 05"
        title="THE TRACE"
        subtitle="a chronological log"
        accent="rgba(253,164,175,0.45)"
      />
      <Timeline />
      <SceneDivider
        index="Scene 06"
        title="SIGNALS"
        subtitle="where the world is clearly wrong"
        accent="rgba(132,204,22,0.4)"
      />
      <Signals />
      <FAQ />
      <SceneDivider
        index="Scene 08"
        title="END CREDITS"
        subtitle="let's build"
        accent="rgba(255,127,80,0.45)"
      />
      <Contact />
    </>
  );
}
