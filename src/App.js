/**
 * Entry application component used to compose providers and render Routes.
 * */

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router'
import jQuery from 'jquery'
window.jQuery = jQuery

function App({ basename }) {
  // jQuery.ajax({
  //   url: 'https://sus.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/o2joag/b/24/e73395c53c3b10fde2303f4bf74ffbf6/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-US&collectorId=00149992',
  //   type: 'get',
  //   cache: true,
  //   dataType: 'script'
  // })

  // window.ATL_JQ_PAGE_PROPS = jQuery.extend(window.ATL_JQ_PAGE_PROPS, {
  //   triggerFunction: function (showCollectorDialog) {
  //     //Requires that jQuery is available!
  //     jQuery(document).ready(function () {
  //       jQuery('#myCustomTrigger').on('click', function (e) {
  //         e.preventDefault()
  //         showCollectorDialog()
  //       })
  //     })
  //   }
  // })

  return (
    <React.Suspense fallback={''}>
      <BrowserRouter basename={basename}>
        <Router />
        {/* <button id='myCustomTrigger' className='btn jira-button'>
          Report feedback
        </button> */}
      </BrowserRouter>
    </React.Suspense>
  )
}

export default App
