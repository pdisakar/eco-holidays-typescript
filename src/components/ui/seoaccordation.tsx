"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

type AccordionItemProps = {
    title: string
    content: React.ReactNode | string
    isOpen?: boolean
    titleClassName?: string
    contentClassName?: string
    className?: string
    toggleClassName?: string
    onToggle?: () => void,
    titleTag?: boolean,
    toggleIcon?: React.ReactNode, toggleActiveIcon?: React.ReactNode
}

export function AccordionItem({
    title,
    content,
    isOpen,
    toggleClassName,
    className,
    titleClassName,
    contentClassName,
    toggleIcon,
    titleTag,
    onToggle
}: AccordionItemProps) {
    const contentRef = useRef<HTMLDivElement>(null)
    const [maxHeight, setMaxHeight] = useState<string>("0px")

    useEffect(() => {
        if (isOpen && contentRef.current) {
            setMaxHeight(`${contentRef.current.scrollHeight}px`)
        } else {
            setMaxHeight("0px")
        }
    }, [isOpen])

    return (
        <div className={cn("item", className)}>
            {titleTag ? <h2
                onClick={onToggle}
                className={cn('item-header transition-colors hover:underline cursor-pointer', titleClassName)}
                aria-expanded={isOpen}
            >
                {title}
                {toggleIcon
                    ? <span className={cn('toggle', toggleClassName)} dangerouslySetInnerHTML={{ __html: toggleIcon as string }} />
                    : <span className={cn('toggle', toggleClassName)} />}
            </h2> : <h3
                onClick={onToggle}
                className={cn('item-header transition-colors hover:underline cursor-pointer', titleClassName)}
                aria-expanded={isOpen}
            >
                {title}
                {toggleIcon
                    ? <span className={cn('toggle', toggleClassName)} dangerouslySetInnerHTML={{ __html: toggleIcon as string }} />
                    : <span className={cn('toggle', toggleClassName)} />}
            </h3>}
            <div
                ref={contentRef}
                className={cn(
                    "item-body overflow-hidden transition-all duration-500 ease-in-out opacity-100",
                    isOpen ? "active visible opacity-100" : "invisible opacity-0"
                )}
                style={{ maxHeight }}
            >
                <div className={contentClassName} dangerouslySetInnerHTML={{ __html: (content ?? "").toString() }} />
            </div>
        </div>
    )
}
type FaqItem = {
    question: string
    answer: string
}

type SeoAccordionProps = {
    items: FaqItem[]
    defaultOpenIndex?: number,
    titleClassName?: string,
    contentClassName?: string
    className?: string
    toggleClassName?: string
    toggleIcon?: React.ReactNode
    toggleActiveIcon?: React.ReactNode
}

export function SeoAccordion({ items, toggleIcon, toggleActiveIcon, titleClassName, toggleClassName, className, contentClassName, defaultOpenIndex = 0 }: SeoAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex)

    const toggleItem = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index))
    }

    return (
        <>
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.question}
                    content={item.answer}
                    isOpen={openIndex === index}
                    onToggle={() => toggleItem(index)}
                    contentClassName={contentClassName}
                    titleClassName={titleClassName}
                    className={cn("border-b", className)}
                    toggleClassName={toggleClassName}
                    toggleIcon={toggleIcon} toggleActiveIcon={toggleActiveIcon}
                />
            ))}
        </>
    )
}
