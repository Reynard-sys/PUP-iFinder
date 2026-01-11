"use client";

const AboutCard = ({ icon, bgColor, fontColor, title, description }) => {
  return (
    <div
      className="
        relative overflow-hidden
        w-[320px]
        sm:w-[420px] sm:h-[480px]
        lg:w-[500px] lg:h-[560px]
        rounded-t-full rounded-b-3xl
        pb-6 sm:pb-0
      "
      style={{ backgroundColor: bgColor, color: fontColor }}
    >
      <div
        className="
          absolute left-1/2 -translate-x-1/2
          top-6 sm:top-8 lg:top-9
          w-[240px] h-[240px]
          sm:w-[320px] sm:h-[320px]
          lg:w-[380px] lg:h-[380px]
          rounded-full bg-white overflow-hidden
        "
      >
        {icon ? (
          <img
            src={icon}
            alt={title}
            className="w-full h-full object-contain"
            loading="eager"
          />
        ) : null}
      </div>

      <div className="h-full px-6 flex flex-col sm:justify-end">
        <div className="min-h-[255px] sm:h-[332px] lg:h-[392px]" />

        <h3 className="font-bold text-lg sm:text-xl lg:text-2xl leading-snug">
          {title}
        </h3>
        <p className="mt-2 text-sm sm:text-base leading-snug">{description}</p>

        <div className="hidden sm:block h-6" />
      </div>
    </div>
  );
};

export default AboutCard;
