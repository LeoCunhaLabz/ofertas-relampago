import React from "react";

export const Package = ({ title, price, description, features, bgColor, hoverColor, index }: {
  title: string,
  price: string,
  description: string,
  features: string[],
  bgColor: string,
  hoverColor: string,
  index: number
}) => (
  <div className={`flex-1 text-xl mt-14 rounded-xl border ${bgColor} p-10 w-full`}>
    <div className={`${bgColor}`}>{title}</div>
    <div className="text-6xl my-5 font-light">{price}</div>
    <div>{description}</div>
    <a
      href={`/checkout/${index}`}
      className={`my-5 w-full text-white font-semibold p-5 max-sm:p-2 rounded-3xl bg-blue-500 text-xl max-sm:text-lg ${hoverColor} transition-all inline-block text-center`}
    >
      Comprar
    </a>
    <ul>
      {features.map((feature, index) => (
        <li key={index} className="py-2 px-4 hover:font-semibold">{feature}</li>
      ))}
    </ul>
  </div>
);