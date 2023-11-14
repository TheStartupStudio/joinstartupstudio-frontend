import React, { useCallback, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import axiosInstance from '../../utils/AxiosInstance'
import IntlMessages from '../../utils/IntlMessages'

import { useSelector } from 'react-redux'
import './style.css'
import coloredSparkIcon from '../../assets/images/colored-spark.png'
import articleIcon from '../../assets/images/My Spark Widget Icons/1.Article.svg'
import aboutUsIcon from '../../assets/images/My Spark Widget Icons/2.About us.svg'
import faqIcon from '../../assets/images/My Spark Widget Icons/3.Faq.svg'
import startUpNamesIcon from '../../assets/images/My Spark Widget Icons/4.Startup Names.svg'
import visionStatementIcon from '../../assets/images/My Spark Widget Icons/5.Vision Statement.svg'
import valuePropositionIcon from '../../assets/images/My Spark Widget Icons/6.Value Proposition.svg'
import startUpIdeasIcon from '../../assets/images/My Spark Widget Icons/7.Startup-Ideas.svg'
import missionStatementIcon from '../../assets/images/My Spark Widget Icons/8.Mission-Statement.svg'
import socialPostIcon from '../../assets/images/My Spark Widget Icons/9.Social-Post.svg'
import socialPostCaptionIcon from '../../assets/images/My Spark Widget Icons/10.Social-Post-Caption.svg'
import videoScriptIcon from '../../assets/images/My Spark Widget Icons/11.Video-Script.svg'
import imageIcon from '../../assets/images/My Spark Widget Icons/12.Image.svg'
import { useHistory } from 'react-router-dom'

function MySpark() {
  const [loading, setLoading] = useState(false)

  const [searchingUsers, setSearchingUsers] = useState(false)

  const loggedUser = useSelector((state) => state?.user?.user?.user)

  const widgets = [
    {
      name: 'Article',
      icon: articleIcon,
      getMazeApiType: 'document',
      type: 'article'
    },
    {
      name: 'About us',
      icon: aboutUsIcon,
      getMazeApiType: 'document',
      type: 'about-us'
    },
    {
      name: 'Faq',
      icon: faqIcon,
      getMazeApiType: 'document',
      type: 'faq'
    },
    {
      name: 'Startup names',
      icon: startUpNamesIcon,
      getMazeApiType: 'document',
      type: 'startup-names'
    },
    {
      name: 'Vision statement',
      icon: visionStatementIcon,
      getMazeApiType: 'document',
      type: 'vision-statement'
    },
    {
      name: 'Value proposition',
      icon: valuePropositionIcon,
      getMazeApiType: 'document',
      type: 'value-proposition'
    },
    {
      name: 'Startup ideas',
      icon: startUpIdeasIcon,
      getMazeApiType: 'document',
      type: 'startup-ideas'
    },
    {
      name: 'Mission statement',
      icon: missionStatementIcon,
      getMazeApiType: 'document',
      type: 'mission-statement'
    },
    {
      name: 'Social post',
      icon: socialPostIcon,
      getMazeApiType: 'document',
      type: 'social-post'
    },
    {
      name: 'Social post caption',
      icon: socialPostCaptionIcon,
      getMazeApiType: 'document',
      type: 'social-post-caption'
    },
    {
      name: 'Video script',
      icon: videoScriptIcon,
      getMazeApiType: 'document',
      type: 'video-script'
    },
    {
      name: 'Image',
      icon: imageIcon,
      getMazeApiType: 'image',
      type: 'image'
    }
  ]
  const history = useHistory()
  return (
    <Container fluid>
      <Row>
        <div className="col-12 col-xl-12 px-0">
          <div className="account-page-padding page-border">
            <div className="row ps-2">
              <div className="col-md-6">
                <h3 className="page-title mb-0">My SPARK</h3>
              </div>
            </div>
            <div
              className={'container-fluid d-flex my-spark-widgets__container'}
            >
              <Col md={11}>
                {' '}
                <div
                  className={
                    'container-fluid spark-widgets__container d-flex justify-content-start'
                  }
                >
                  <Row className={'spark-widgets__row-container'}>
                    {widgets.map((widget) => {
                      return (
                        <Col
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          className={'spark-widget-box__container mb-3 mt-5'}
                        >
                          <div
                            className={
                              'spark-widget__container position-relative '
                            }
                            onClick={() =>
                              history.push(`/my-spark/widgets/${widget.type}`, {
                                widgetName: widget.name,
                                widgetType: widget.type,
                                widgetApiType: widget.getMazeApiType
                              })
                            }
                          >
                            <img
                              src={widget.icon}
                              alt={'widget-icon'}
                              className={'widget-icon position-absolute'}
                            />

                            <div className={'spark-widget__title'}>
                              {widget.name}
                            </div>
                          </div>
                        </Col>
                      )
                    })}
                  </Row>
                </div>
              </Col>
              <Col md={1} className={'position-relative'}>
                <img
                  src={coloredSparkIcon}
                  alt={'my-spark-icon'}
                  className={'my-spark-icon '}
                />
              </Col>
            </div>
          </div>
        </div>
      </Row>
    </Container>
  )
}

export default MySpark
