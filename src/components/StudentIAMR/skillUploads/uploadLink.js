const UploadLink = ({ link }) => {
  return (
    <div className='col-12 mb-2'>
      <span className='page-content-title mb-2'>LINK</span>
      <div className='upload-item'>
        <a
          href={link?.startsWith('http') ? link : `https://${link}`}
          rel='noreferrer'
          target={'_blank'}
          className='my-auto'
        >
          {link?.length > 40 ? link.toString().substring(0, 30) + '...' : link}
        </a>
      </div>
    </div>
  )
}

export default UploadLink
