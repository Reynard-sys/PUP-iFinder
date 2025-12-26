"use client"

const AboutCard = ({ icon, bgColor, fontColor, title, description}) => {

    return (
        <div 
            className="flex flex-col justify-between items-center 
            w-[350px] h-[350px]
            sm:w-[550px] h-[700px]
            pt-5 pb-7 rounded-t-full"
            style={{ backgroundColor: bgColor, color: fontColor }}
        >
            
            <div className="flex justify-center items-center 
            w-[300px] h-[300px]
            sm:w-[500px] h-[500px]
            rounded-full bg-white overflow-hidden">
                {icon ? (
                    <img 
                        src={icon}
                        alt={title}
                        className="w-full h-full object-contain"
                        loading="eager"
                    />
                ): null}
            </div>

            <div className="flex flex-col gap-2 self-start px-5">
                <h3 className="font-bold text-2xl">{title}</h3>
                <p className="text-base">{description}</p>
            </div>

        </div>
    )

}

export default AboutCard