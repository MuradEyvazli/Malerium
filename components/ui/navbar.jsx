'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import * as React from 'react';

const Menu = ({
  list
}) => {
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <MotionConfig transition={{ bounce: 0, type: 'tween' }}>
      <nav className={'relative m-4 flex items-center justify-between'}>
        {/* Logo Section */}
        <div className="flex items-center">
          <motion.a
            href="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#000000] to-[#000dff] mb-4 hover:text-gray-700 transition duration-300 ml-4"
            whileHover={{ scale: 1.1 }}
          >
            Malerium
          </motion.a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? '✖' : '☰'}
        </button>

        {/* Desktop Navigation Menu */}
        <ul className={`hidden md:flex items-center`}>
          {list?.map((item) => {
            return (
              <li key={item.id} className={'relative ml-6'}>
                <Link
                  className={
                    `relative flex items-center justify-center rounded px-8 py-3 transition-all hover:bg-white/[0.1] ${hovered === item?.id && 'bg-white/0.1'}`
                  }
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  href={item?.url}>
                  {item?.title}
                </Link>
                {hovered === item?.id && !item?.dropdown && (
                  <motion.div layout layoutId={`cursor`} className={'absolute h-0.5 w-full bg-black'} />
                )}
                {item?.dropdown && hovered === item?.id && (
                  <div
                    className='absolute left-0 top-full'
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}>
                    <motion.div
                      layout
                      transition={{ bounce: 0 }}
                      initial={{ y: 10 }}
                      animate={{ y: 0 }}
                      exit={{ y: 10 }}
                      style={{
                        borderRadius: '8px',
                      }}
                      className='mt-4 flex w-64 flex-col rounded bg-white'
                      layoutId={'cursor'}>
                      {item?.items?.map((nav) => {
                        return (
                          <motion.a
                            key={`link-${nav?.id}`}
                            href={`${nav?.url}`}
                            className={'w-full bg-slate-50 p-4 text-black'}>
                            {nav?.title}
                          </motion.a>
                        );
                      })}
                    </motion.div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 md:hidden"
          >
            {list?.map((item) => (
              <li key={item.id} className="w-full text-center">
                <Link
                  href={item?.url}
                  className="block px-6 py-2 text-black hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  {item?.title}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </nav>
    </MotionConfig>
  );
};

export default Menu;