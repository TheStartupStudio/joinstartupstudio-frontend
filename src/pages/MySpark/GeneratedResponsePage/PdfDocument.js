import React from 'react'
import { imageResolutionToPercentage } from '../mySparkHelpersFuncs'
import './PdfDocument.css'

const PdfDocument = ({ archivedDocument }) => {
  const imageDimensions = archivedDocument
    ? imageResolutionToPercentage(archivedDocument.imageResolution)
    : { width: 'auto', height: 'auto' }

  return (
    <div className='pdf-document'>
      <div className='page'>
        <div className='section'>
          <span>
            <h2>{archivedDocument?.widgetName?.toUpperCase()}</h2>
          </span>
          <span>
            <h3>{archivedDocument?.title}</h3>
          </span>
        </div>
      </div>
      <div className='page content'>
        <div className='section'>
          {archivedDocument.type !== 'image' ? (
            <div
              dangerouslySetInnerHTML={{ __html: archivedDocument?.myContent }}
            />
          ) : (
            <div className='image-container'>
              <img
                src={archivedDocument?.imageUrl}
                alt={archivedDocument?.name}
                style={{
                  margin: '0 auto',
                  width: imageDimensions.width,
                  height: imageDimensions.height
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PdfDocument

// import React from 'react'
// import {
//   Document,
//   Image,
//   Page,
//   StyleSheet,
//   Text,
//   View
// } from '@react-pdf/renderer'
// import { imageResolutionToPercentage } from '../mySparkHelpersFuncs'
// import Html from 'react-pdf-html'
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'row',
//     backgroundColor: '#E4E4E4'
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1
//   }
// })

// const PdfDocument = ({ archivedDocument }) => {
//   return (
//     <Document>
//       <Page size='A4'>
//         <View style={styles.page}>
//           <View style={styles.section}>
//             <Text style={{ fontSize: 14 }}>
//               {archivedDocument?.widgetName?.toUpperCase()}
//             </Text>
//           </View>
//           <View style={styles.section}>
//             <Text>{archivedDocument?.title}</Text>
//           </View>
//           <View style={styles.section}>
//             <Text></Text>
//           </View>
//         </View>
//         <View style={{ ...styles.page, backgroundColor: '#fff' }}>
//           <View style={styles.section}>
//             {archivedDocument.type !== 'image' && (
//               <Html>{archivedDocument?.myContent}</Html>
//             )}
//             {archivedDocument.type === 'image' && (
//               <View style={{ display: 'flex', justifyContent: 'center' }}>
//                 <Image
//                   src={archivedDocument?.imageUrl}
//                   alt={archivedDocument?.name}
//                   style={{
//                     marginHorizontal: 'auto',
//                     width: imageResolutionToPercentage(
//                       archivedDocument?.imageResolution
//                     ).width,
//                     height: imageResolutionToPercentage(
//                       archivedDocument?.imageResolution
//                     ).height
//                   }}
//                 />
//               </View>
//             )}
//           </View>
//         </View>
//       </Page>
//     </Document>
//   )
// }

// export default PdfDocument
