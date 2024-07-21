import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear().toString();

    return (
        <div className='py-4 sm:py-6 lg:py-8 pl-0 md:pl-20 dark:bg-[#111827]'>
            <div className='w-full sm:px-7 lg:px-10 flex flex-col sm:flex-row space-y-8 sm:space-y-0 justify-between items-center sm:items-end'>
                <div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 items-center sm:items-start lg:items-center text-sm'>
                    <div className='flex justify-center text-base text-[#b8b8b8]'>
                        <p>
                            © <time dateTime={currentYear}>{currentYear}</time> Earn by StackUp
                        </p>
                    </div>
                    <div className='flex flex-col sm:flex-row items-center sm:justify-center gap-y-3 sm:space-x-6 font-semibold text-[#5d5d5d]'>
                        <a target="_blank" href="https://stackuphelpcentre.zendesk.com/hc/en-us">
                            <span className='hover:underline'>Help Centre</span>
                        </a>
                        <a target="_blank" href="https://stackup.dev/earn/terms">
                            <span className='hover:underline'>Terms of Service</span>
                        </a>
                        <a target="_blank" href="https://stackup.dev/privacy">
                            <span className='hover:underline'>Privacy Policy</span>
                        </a>
                    </div>
                </div>
                <div className='flex justify-center space-x-4'>
                    <a className='hover:filter hover:brightness-75' href="https://twitter.com/StackUpHQ">
                        <img src="x.svg" alt="x" className='w-8 h-8' />
                    </a>
                    <a className='hover:filter hover:brightness-75' href="https://discord.gg/3x3h2z6A63">
                        <img src="discord.svg" alt="discord" className='w-8 h-8' />
                    </a>
                    <a className='hover:filter hover:brightness-75' href="https://www.linkedin.com/company/stackupofficial/">
                        <img src="linkedin.svg" alt="linkedin" className='w-8 h-8' />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Footer;