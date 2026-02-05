import React, { useState, useCallback, useEffect, useRef } from 'react'
import './AddJournalModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus, faTrash, faPencilAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import ReactQuill from 'react-quill'
import axiosInstance from '../../../utils/AxiosInstance'

const AddJournalModal = ({
    show,
    onClose,
    onProceedToIntroduction,
    mode = 'add', 
    existingData = null,
    contentId = null
}) => {
    const [journalTitle, setJournalTitle] = useState('')
    const [selectedIcon, setSelectedIcon] = useState('')
    const [activeTab, setActiveTab] = useState('names') 
    const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false)
    const [sections, setSections] = useState([
        { id: 1, name: '', detailsText: '', detailsRich: '' },
        { id: 2, name: '', detailsText: '', detailsRich: '' }
    ])
    const [loading, setLoading] = useState(false)

    const fetchJournalData = useCallback(async (id) => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(`/manage-content/full/${id}`)
            if (response.data.success) {
                return response.data.data
            } else {
                throw new Error('Failed to fetch journal data')
            }
        } catch (error) {
            console.error('Error fetching journal data:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }, [])

    const initializeFormData = useCallback((data) => {
        console.log('Initializing form data:', data)

        if (data.manageContent) {
            console.log('Setting journal title:', data.manageContent.title, 'icon:', data.manageContent.icon)
            setJournalTitle(data.manageContent.title || '')
            setSelectedIcon(data.manageContent.icon || '')
        }

        if (data.journalLevels && Array.isArray(data.journalLevels)) {
            console.log('Processing journal levels:', data.journalLevels.length)
            const mappedSections = data.journalLevels.map((level, index) => {
                const htmlContent = level.relatedJournals && level.relatedJournals.length > 0
                    ? level.relatedJournals[0].content || ''
                    : '';

                const plainText = htmlContent.replace(/<[^>]*>/g, '').trim();

                console.log(`Section ${index + 1}:`, level.title, 'HTML content length:', htmlContent.length, 'Plain text length:', plainText.length)

                return {
                    id: level.id || (index + 1),
                    journalId: level.relatedJournals && level.relatedJournals.length > 0 ? level.relatedJournals[0].id : null,
                    name: level.title || '',
                    detailsText: plainText,
                    detailsRich: htmlContent
                };
            })
            console.log('Mapped sections:', mappedSections)
            setSections(mappedSections.length > 0 ? mappedSections : [
                { id: 1, journalId: null, name: '', detailsText: '', detailsRich: '' },
                { id: 2, journalId: null, name: '', detailsText: '', detailsRich: '' }
            ])
        } else {
            console.log('No journal levels found')
        }
    }, [])

    const resetForm = useCallback(() => {
        setJournalTitle('')
        setSelectedIcon('')
        setSections([
            { id: 1, journalId: null, name: '', detailsText: '', detailsRich: '' },
            { id: 2, journalId: null, name: '', detailsText: '', detailsRich: '' }
        ])
        setActiveTab('names')
        setIsIconDropdownOpen(false)
    }, [])

    const isMountedRef = useRef(true)

    useEffect(() => {
        console.log('useEffect triggered:', { mode, existingData: !!existingData, contentId, show })

        if (mode === 'edit' || mode === 'view') {
            if (existingData) {
                console.log('Using existing data prop')
                initializeFormData(existingData)
            } else if (contentId) {
                console.log('Fetching data from API for contentId:', contentId)
                fetchJournalData(contentId).then(data => {
                    if (isMountedRef.current) {
                        console.log('Data fetched successfully:', data)
                        initializeFormData(data)
                    }
                }).catch(error => {
                    if (isMountedRef.current) {
                        console.error('Failed to load journal data:', error)
                        alert(`Failed to load journal data: ${error.message}`)
                    }
                })
            } else {
                console.log('No existingData or contentId provided for edit/view mode')
            }
        } else {
            console.log('Resetting form for add mode')
            resetForm()
        }

        return () => {
            isMountedRef.current = false
        }
    }, [mode, existingData, contentId, fetchJournalData, initializeFormData, resetForm])

    const sendJournalDataToAPI = useCallback(async (journalData, isEdit = false) => {
        try {
            const url = isEdit && contentId ? `/manage-content/full/${contentId}` : '/journalnewcontent'

            const payload = isEdit ? {
                manageContent: {
                    title: journalData.title,
                    icon: journalData.icon
                },
                journalLevels: journalData.sections.map(section => ({
                    id: section.id,
                    title: section.name,
                    detailsText: section.detailsText,
                    order: section.id,
                    published: true,
                    category: 'student-leadership',
                    content: section.detailsRich || '' 
                }))
            } : {
                ...journalData,
                timestamp: new Date().toISOString()
            }

            const response = await axiosInstance({
                method: isEdit ? 'put' : 'post',
                url,
                data: payload
            })

            if (response.data.success) {
                console.log(`Journal data ${isEdit ? 'updated' : 'sent'} successfully to API`)

                if (isEdit) {
                    console.log('Updating journal content separately...')
                    console.log('Number of sections to update:', journalData.sections.length)
                    for (const section of journalData.sections) {
                        console.log(`Checking section ${section.id}: detailsRich exists: ${!!section.detailsRich}, journalId: ${section.journalId}`)
                        if (section.detailsRich && section.journalId) {
                            try {
                                const contentPayload = {
                                    content: section.detailsRich
                                }

                                console.log(`Updating journal ${section.journalId} with content:`, section.detailsRich.substring(0, 50) + '...')
                                console.log('Full content payload:', contentPayload)

                                const contentResponse = await axiosInstance.put(`/ltsJournals/${section.journalId}`, contentPayload)
                                console.log(`Journal ${section.journalId} content update response:`, contentResponse)
                                console.log(`Journal ${section.journalId} content updated successfully`)
                            } catch (contentError) {
                                console.error(`Failed to update content for journal ${section.journalId}:`, contentError)
                                console.error('Error details:', contentError.response?.data || contentError.message)
                            }
                        } else {
                            console.log(`Skipping section update - detailsRich: ${!!section.detailsRich}, journalId: ${section.journalId}`)
                        }
                    }
                }

                return response.data
            } else {
                throw new Error(`Failed to ${isEdit ? 'update' : 'send'} journal data to API`)
            }
        } catch (error) {
            console.error(`Error ${isEdit ? 'updating' : 'sending'} journal data to API:`, error)
            throw error
        }
    }, [contentId])

    const iconOptions = [
        {
            id: 'leader',
            name: 'Leader',
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14.5 2H4.5C4.23478 2 3.98043 2.10536 3.79289 2.29289C3.60536 2.48043 3.5 2.73478 3.5 3V21C3.5 21.2652 3.60536 21.5196 3.79289 21.7071C3.98043 21.8946 4.23478 22 4.5 22H18.5C18.7652 22 19.0196 21.8946 19.2071 21.7071C19.3946 21.5196 19.5 21.2652 19.5 21V10.0025" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.5 9H10.5M6.5 14H12.5" stroke="black" stroke-width="2" stroke-linecap="round"/>
            <path d="M20.5 3L14.5015 8.9975" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        },
        {
            id: 'book',
            name: 'Book/Document',
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M21.3337 29.666V26.224L24.4457 26.7487C24.7184 26.7947 24.9977 26.7836 25.2659 26.7161C25.5342 26.6486 25.7855 26.5263 26.004 26.3567C26.2225 26.1872 26.4035 25.9742 26.5356 25.7311C26.6676 25.4881 26.7477 25.2203 26.771 24.9447L27.1537 20.4034C28.387 20.1267 29.2737 19.6807 29.849 19.3087C30.365 18.9753 30.425 18.302 30.081 17.7927L27.317 13.7013C26.989 7.55135 21.8983 2.66602 15.667 2.66602V29.666" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 16C2 16.5304 2.21071 17.0391 2.58579 17.4142C2.96086 17.7893 3.46957 18 4 18C4.53043 18 5.03914 17.7893 5.41421 17.4142C5.78929 17.0391 6 16.5304 6 16C6 15.4696 5.78929 14.9609 5.41421 14.5858C5.03914 14.2107 4.53043 14 4 14C3.46957 14 2.96086 14.2107 2.58579 14.5858C2.21071 14.9609 2 15.4696 2 16ZM5.33333 6C5.33333 6.26264 5.38506 6.52272 5.48557 6.76537C5.58608 7.00802 5.7334 7.2285 5.91912 7.41421C6.10484 7.59993 6.32532 7.74725 6.56797 7.84776C6.81062 7.94827 7.07069 8 7.33333 8C7.59598 8 7.85605 7.94827 8.0987 7.84776C8.34135 7.74725 8.56183 7.59993 8.74755 7.41421C8.93326 7.2285 9.08058 7.00802 9.18109 6.76537C9.2816 6.52272 9.33333 6.26264 9.33333 6C9.33333 5.73736 9.2816 5.47728 9.18109 5.23463C9.08058 4.99198 8.93326 4.7715 8.74755 4.58579C8.56183 4.40007 8.34135 4.25275 8.0987 4.15224C7.85605 4.05173 7.59598 4 7.33333 4C7.07069 4 6.81062 4.05173 6.56797 4.15224C6.32532 4.25275 6.10484 4.40007 5.91912 4.58579C5.7334 4.7715 5.58608 4.99198 5.48557 5.23463C5.38506 5.47728 5.33333 5.73736 5.33333 6ZM4.66667 26.6667C4.66667 27.1971 4.87738 27.7058 5.25245 28.0809C5.62753 28.456 6.13623 28.6667 6.66667 28.6667C7.1971 28.6667 7.70581 28.456 8.08088 28.0809C8.45595 27.7058 8.66667 27.1971 8.66667 26.6667C8.66667 26.1362 8.45595 25.6275 8.08088 25.2525C7.70581 24.8774 7.1971 24.6667 6.66667 24.6667C6.13623 24.6667 5.62753 24.8774 5.25245 25.2525C4.87738 25.6275 4.66667 26.1362 4.66667 26.6667Z" stroke="black" strokeWidth="2"/>
                <path d="M6 15.9993H15.6667M15.6667 10.666H12L9 7.66602M15.6667 21.9993H11.3333L8.33333 24.9993" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        },
        {
            id: 'star',
            name: 'Star',
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M21.8671 28.0005H18.9951L16.3285 21.3338H7.67246L5.00579 28.0005H2.13379L10.6671 6.66712H13.3338L21.8671 28.0005ZM28.0005 16.0005V28.0005H25.3338V16.0005H28.0005ZM8.73912 18.6671H15.2618L12.0005 10.5138L8.73912 18.6671ZM26.0391 3.09378C26.0892 2.96812 26.1758 2.86037 26.2877 2.78446C26.3997 2.70855 26.5319 2.66797 26.6671 2.66797C26.8024 2.66797 26.9345 2.70855 27.0465 2.78446C27.1585 2.86037 27.2451 2.96812 27.2951 3.09378L27.6325 3.90712C28.1984 5.28722 29.2722 6.3977 30.6325 7.00978L31.5885 7.43645C31.7109 7.49309 31.8145 7.58357 31.8871 7.69722C31.9598 7.81086 31.9984 7.94291 31.9984 8.07779C31.9984 8.21266 31.9598 8.34471 31.8871 8.45835C31.8145 8.572 31.7109 8.66248 31.5885 8.71912L30.5778 9.16978C29.2506 9.76435 28.1945 10.8347 27.6178 12.1698L27.2898 12.9245C27.2385 13.0473 27.1521 13.1523 27.0413 13.2261C26.9304 13.3 26.8003 13.3394 26.6671 13.3394C26.534 13.3394 26.4038 13.3 26.293 13.2261C26.1822 13.1523 26.0957 13.0473 26.0445 12.9245L25.7151 12.1711C25.139 10.8358 24.0834 9.76494 22.7565 9.16978L21.7431 8.71912C21.6203 8.66264 21.5163 8.57214 21.4434 8.45836C21.3705 8.34457 21.3318 8.21226 21.3318 8.07712C21.3318 7.94198 21.3705 7.80967 21.4434 7.69588C21.5163 7.58209 21.6203 7.49159 21.7431 7.43512L22.7005 7.00845C24.0607 6.39728 25.1349 5.28779 25.7018 3.90845L26.0391 3.09378Z" fill="black"/>
            </svg>
        },
        {
            id: 'arrow',
            name: 'Arrow',
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 27C5.73586 26.9965 5.4835 26.8901 5.29671 26.7033C5.10992 26.5165 5.00345 26.2641 5 26V6C5 5.73478 5.10536 5.48043 5.29289 5.29289C5.48043 5.10536 5.73478 5 6 5C6.26522 5 6.51957 5.10536 6.70711 5.29289C6.89464 5.48043 7 5.73478 7 6V26C6.99655 26.2641 6.89008 26.5165 6.70329 26.7033C6.5165 26.8901 6.26414 26.9965 6 27Z" fill="black"/>
                <path d="M26 26.9991H6C5.73478 26.9991 5.48043 26.8938 5.29289 26.7063C5.10536 26.5187 5 26.2644 5 25.9991C5 25.7339 5.10536 25.4796 5.29289 25.292C5.48043 25.1045 5.73478 24.9991 6 24.9991H26C26.2652 24.9991 26.5196 25.1045 26.7071 25.292C26.8946 25.4796 27 25.7339 27 25.9991C27 26.2644 26.8946 26.5187 26.7071 26.7063C26.5196 26.8938 26.2652 26.9991 26 26.9991ZM18.6667 19.6658C18.5353 19.6664 18.4051 19.6408 18.2837 19.5904C18.1624 19.5401 18.0523 19.466 17.96 19.3725L14.6667 16.0791L11.3733 19.3725C11.1838 19.5491 10.933 19.6453 10.674 19.6407C10.4149 19.6361 10.1677 19.5312 9.9845 19.348C9.80129 19.1648 9.69634 18.9176 9.69177 18.6585C9.6872 18.3994 9.78336 18.1487 9.96 17.9591L13.96 13.9591C14.1475 13.7719 14.4017 13.6667 14.6667 13.6667C14.9317 13.6667 15.1858 13.7719 15.3733 13.9591L18.6667 17.2525L23.2933 12.6258C23.4829 12.4492 23.7336 12.353 23.9927 12.3576C24.2518 12.3621 24.4989 12.4671 24.6822 12.6503C24.8654 12.8335 24.9703 13.0807 24.9749 13.3398C24.9795 13.5989 24.8833 13.8496 24.7067 14.0391L19.3733 19.3725C19.281 19.466 19.1709 19.5401 19.0496 19.5904C18.9282 19.6408 18.7981 19.6664 18.6667 19.6658Z" fill="black"/>
                <path d="M24.6667 18.4527C24.4025 18.4492 24.1502 18.3428 23.9634 18.156C23.7766 17.9692 23.6701 17.7168 23.6667 17.4527V13.666H20C19.7348 13.666 19.4804 13.5607 19.2929 13.3731C19.1054 13.1856 19 12.9312 19 12.666C19 12.4008 19.1054 12.1464 19.2929 11.9589C19.4804 11.7714 19.7348 11.666 20 11.666H24.6667C24.9308 11.6695 25.1832 11.7759 25.37 11.9627C25.5567 12.1495 25.6632 12.4019 25.6667 12.666V17.4527C25.6632 17.7168 25.5567 17.9692 25.37 18.156C25.1832 18.3428 24.9308 18.4492 24.6667 18.4527Z" fill="black"/>
            </svg>
        },
        {
            id: 'article',
            name: 'Article',
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M29.3333 4H2.66667C1.21333 4.05333 0.0533333 5.21333 0 6.66667V25.3333C0.0533333 26.7867 1.21333 27.9467 32 25.3333C31.9755 5.96724 31.6866 5.30312 31.1918 4.80825C30.6969 4.31337 30.0328 4.02454 29.3333 4ZM29.3333 25.3333H2.66667V6.66667H29.3333V25.3333ZM18.6667 22.6667V21C18.6667 18.7867 14.2133 17.6667 12 17.6667C9.78667 17.6667 5.33333 18.7867 5.33333 21V22.6667H18.6667ZM12 9.33333C11.1159 9.33333 10.2681 9.68452 9.64298 10.3096C9.01786 10.9348 8.66667 11.7826 8.66667 12.6667C8.66667 13.1044 8.75289 13.5379 8.9204 13.9423C9.08792 14.3467 9.33345 14.7142 9.64298 15.0237C10.2681 15.6488 11.1159 16 12 16C12.4377 16 12.8712 15.9138 13.2756 15.7463C13.68 15.5787 14.0475 15.3332 14.357 15.0237C14.6666 14.7142 14.9121 14.3467 15.0796 13.9423C15.2471 13.5379 15.3333 13.1044 15.3333 12.6667C15.3333 12.2289 15.2471 11.7955 15.0796 11.3911C14.9121 10.9866 14.6666 10.6192 14.357 10.3096C14.0475 10.0001 13.68 9.75458 13.2756 9.58707C12.8712 9.41955 12.4377 9.33333 12 9.33333ZM18.6667 9.33333V10.6667H26.6667V9.33333H18.6667ZM18.6667 12V13.3333H26.6667V12H18.6667ZM18.6667 14.6667V16H24V14.6667H18.6667Z" fill="black"/>
            </svg>
        },
        {
            id: 'grid',
            name: 'Grid',
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M26.667 5.33398H5.33366C3.85366 5.33398 2.68033 6.52065 2.68033 8.00065L2.66699 24.0007C2.66699 25.4807 3.85366 26.6673 5.33366 26.6673H26.667C28.147 26.6673 29.3337 25.4807 29.3337 24.0007V8.00065C29.3337 6.52065 28.147 5.33398 26.667 5.33398ZM26.667 24.0007H5.33366V16.0007H26.667V24.0007ZM26.667 10.6673H5.33366V8.00065H26.667V10.6673Z" fill="black"/>
            </svg>
        }
    ]

    const handleAddSection = useCallback(() => {
        setSections(prevSections => {
            const newSection = {
                id: prevSections.length + 1,
                name: '',
                detailsText: '',
                detailsRich: ''
            }
            return [...prevSections, newSection]
        })
    }, [])

    const handleDeleteSection = useCallback((id) => {
        setSections(prevSections => {
            if (prevSections.length > 1) {
                return prevSections.filter(section => section.id !== id)
            }
            return prevSections
        })
    }, [])

    const handleSectionNameChange = useCallback((id, value) => {
        setSections(prevSections => prevSections.map(section =>
            section.id === id ? { ...section, name: value } : section
        ))
    }, [])

    const handleSectionDetailsTextChange = useCallback((id, value) => {
        setSections(prevSections => prevSections.map(section =>
            section.id === id ? { ...section, detailsText: value } : section
        ))
    }, [])

    const handleSectionDetailsRichChange = useCallback((id, value) => {
        setSections(prevSections => prevSections.map(section =>
            section.id === id ? { ...section, detailsRich: value } : section
        ))
    }, [])

    const handleIconSelect = useCallback((iconId) => {
        setSelectedIcon(iconId)
        setIsIconDropdownOpen(false)
    }, [])

    const handleIconDropdownToggle = useCallback(() => {
        setIsIconDropdownOpen(!isIconDropdownOpen)
    }, [isIconDropdownOpen])

    const getSelectedIconSvg = () => {
        const selectedOption = iconOptions.find(option => option.id === selectedIcon)
        return selectedOption ? selectedOption.svg : null
    }

    const validateForm = () => {
        if (!journalTitle.trim()) {
            return false
        }

        if (!selectedIcon) {
            return false
        }

        const hasEmptySections = sections.some(section => !section.name.trim())
        if (hasEmptySections) {
            return false
        }

        return true
    }

    const handleSave = async () => {
        if (mode === 'view') return 

        if (!validateForm()) {
            alert('Please fill in all required fields: Journal Title, Icon, and Section Names')
            return
        }

        setLoading(true)

        try {
            // Prepare data for the new /full endpoint
            const journalData = {
                manageContent: {
                    ...(mode === 'edit' && contentId ? { id: contentId } : {}),
                    title: journalTitle,
                    icon: selectedIcon
                    // Other fields will be added in AddJournalIntroduction
                },
                // Only send journalLevels for new journal creation, not for updates
                ...(mode === 'add' ? {
                    journalLevels: sections
                        .filter(section => section.name && section.name.trim() !== '')
                        .map((section, index) => ({
                            title: section.name,
                            order: index + 1,
                            published: true,
                            category: 'student-leadership',
                            detailsText: section.detailsText,
                            content: section.detailsRich || ''
                        }))
                } : {})
            }

            console.log('Saving journal data:', journalData)

            let response
            if (mode === 'edit' && contentId) {
                // Use PUT for updating existing journal
                response = await axiosInstance.put(`/manage-content/full/${contentId}`, journalData)
                console.log('Journal updated successfully:', response.data.data)
            } else {
                // Use POST for creating new journal
                response = await axiosInstance.post('/manage-content/full', journalData)
                console.log('Journal created successfully:', response.data.data)
            }

            if (response.data.success) {
                if (mode === 'add') {
                    // For new journal creation, just show success and close
                    alert('Journal created successfully!')
                    onClose()
                } else if (mode === 'edit') {
                    if (onProceedToIntroduction) {
                        onProceedToIntroduction(response.data.data)
                    } else {
                        alert('Journal updated successfully!')
                        onClose()
                    }
                }
            } else {
                throw new Error(response.data.error || 'Failed to save journal')
            }
        } catch (error) {
            alert(`Failed to ${mode === 'edit' ? 'update' : 'create'} journal: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        if (mode === 'add') {
            resetForm()
        }
        onClose()
    }

    if (!show) return null

    return (
        <>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p>Loading journal data...</p>
                    </div>
                </div>
            )}

            <div className="add-journal-modal-overlay">
                <div className="add-journal-modal">
                    <div className="modal-header">
                    <div className="circle-icon-heading">
                        <div className="circle-icon">
                            <div className="icon-circle-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M3.33301 9.99935V2.26602C3.33301 1.93464 3.60164 1.66602 3.93301 1.66602H13.5011C13.6603 1.66602 13.8129 1.72923 13.9254 1.84175L16.4906 4.40695C16.6031 4.51947 16.6663 4.67208 16.6663 4.83121V17.7327C16.6663 18.0641 16.3977 18.3327 16.0663 18.3327H9.16634" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M13.333 1.66602V4.39935C13.333 4.73072 13.6016 4.99935 13.933 4.99935H16.6663" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M1.66016 15.834H4.16016M6.66016 15.834H4.16016M4.16016 15.834V13.334M4.16016 15.834V18.334" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <p className="modal-title">
                            {mode === 'view' ? 'View Journal' : mode === 'edit' ? 'Edit Journal' : 'Add New Journal'}
                        </p>
                    </div>
                </div>

                <div style={{ padding: '0 40px' }}>
                    <div className="form-section">
                        {/* Journal Basics Section */}
                        <div className="section-group">
                            <div className="section-header">
                                <div className="section-header-content">
                                    <div className="spark-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <g clip-path="url(#clip0_4724_21225)">
                                            <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_4724_21225">
                                                <rect width="20" height="20" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg></div>
                                    <span>Journal Basics</span>
                                </div>
                            </div>

                            <div className="journal-basics-inputs">
                                <div className="input-box flex-1">
                                    <input
                                        type="text"
                                        placeholder="Add Journal Title (i.e. Leadership Journal)..."
                                        value={journalTitle}
                                        onChange={(e) => setJournalTitle(e.target.value)}
                                        className="journal-input"
                                        disabled={mode === 'view'}
                                    />
                                    <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />
                                </div>
                                <div className="input-box icon-select" onClick={mode !== 'view' ? handleIconDropdownToggle : undefined} style={{ cursor: mode === 'view' ? 'default' : 'pointer' }}>
                                    {selectedIcon ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {getSelectedIconSvg()}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="select-text">Select Menu Icon</span>
                                    )}
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`input-icon ${isIconDropdownOpen ? 'rotated' : ''}`}
                                    />
                                </div>

                                {isIconDropdownOpen && (
                                    <div className="icon-dropdown-menu">
                                        {iconOptions.map((option) => (
                                            <div
                                                key={option.id}
                                                className={`icon-dropdown-item ${selectedIcon === option.id ? 'selected' : ''}`}
                                                onClick={() => handleIconSelect(option.id)}
                                            >
                                                <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {option.svg}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sections Content */}
                        <div className="sections-content">
                            <div className="tab-navigation">
                                <button
                                    className={`tab-btn ${activeTab === 'names' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('names')}
                                >
                                    Section Names
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('details')}
                                >
                                    Section Details
                                </button>
                            </div>

                            {activeTab === 'names' && (
                                <div className="sections-panel">
                                    <div className="sections-box">
                                        <div className="section-header">
                                            <div className="section-header-content">
                                                <div className="spark-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <g clip-path="url(#clip0_4724_21225)">
                                                        <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_4724_21225">
                                                            <rect width="20" height="20" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg></div>
                                                <span>Sections</span>
                                            </div>
                                        </div>

                                        {sections.map((section, index) => (
                                            <div key={section.id} className="section-row">
                                                {mode === 'add' && (
                                                    <div className="reorder-icon">
                                                        <div className="reorder-lines">
                                                            <span></span>
                                                            <span></span>
                                                            <span></span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="input-box flex-1">
                                                    <input
                                                        type="text"
                                                        placeholder="Add section name..."
                                                        value={section.name}
                                                        onChange={(e) => handleSectionNameChange(section.id, e.target.value)}
                                                        className="section-input"
                                                        disabled={mode === 'view'}
                                                    />
                                                    <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />
                                                </div>
                                                {mode === 'add' && (
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleDeleteSection(section.id)}
                                                        disabled={sections.length === 1}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {mode === 'add' && (
                                            <div className="add-section-footer">
                                                <button
                                                    className="add-new-section-btn"
                                                    onClick={handleAddSection}
                                                >
                                                    <span>Add New Section</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M5 10H10M15 10H10M10 10V5M10 10V15" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'details' && (
                                <div className="sections-panel">
                                    <div className="sections-box">
                                        {sections.map((section) => (
                                            <div key={section.id} className="section-detail-item" style={{ marginBottom: '30px' }}>
                                                <div className="section-header" style={{ marginBottom: '15px' }}>
                                                    <div className="section-header-content">
                                                        <div className="spark-icon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                <g clip-path="url(#clip0_4724_21225)">
                                                                    <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                                                                </g>
                                                                <defs>
                                                                    <clipPath id="clip0_4724_21225">
                                                                        <rect width="20" height="20" fill="white" />
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                        </div>
                                                        <span>Section {section.id}: {section.name || 'Unnamed Section'}</span>
                                                    </div>
                                                </div>
                                                <div className="section-details-content">
                                                    {/* <input
                                                        style={{
                                                            border: '1px solid rgba(227, 229, 233, 0.50)',
                                                            borderRadius: '8px',
                                                            padding: '12px 18px',
                                                            width: '100%',
                                                            fontSize: '16px',
                                                            fontWeight: '500',
                                                            color: '#333',
                                                            backgroundColor: 'transparent',
                                                            marginBottom: '10px',
                                                        }}
                                                        type="text"
                                                        placeholder="Add section details..."
                                                        value={section.detailsText}
                                                        onChange={(e) => handleSectionDetailsTextChange(section.id, e.target.value)}
                                                        disabled={mode === 'view'}
                                                    /> */}
                                                    <ReactQuill
                                                        value={section.detailsRich}
                                                        onChange={(value) => handleSectionDetailsRichChange(section.id, value)}
                                                        readOnly={mode === 'view'}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ padding: '0 40px', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                        <button className="cancel-btn" onClick={handleCancel}>
                            {mode === 'view' ? 'Close' : 'Cancel'}
                        </button>
                        {mode !== 'view' && (
                            <button className="save-btn" onClick={handleSave} disabled={loading}>
                                {loading ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Save')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddJournalModal

