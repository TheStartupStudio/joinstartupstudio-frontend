import { Modal, ModalBody } from 'reactstrap'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import AWS from '../../assets/images/academy-icons/AWS.png'
import Security from '../../assets/images/academy-icons/Security.png'
import Shield from '../../assets/images/academy-icons/Shield.png'
import frontS from '../../assets/images/academy-icons/frontend-security.png'
import backS from '../../assets/images/academy-icons/backend-security.png'
import rdsMysql from '../../assets/images/rds-mysql.png'
import generalSecurity from '../../assets/images/academy-icons/general-security.png'
import cicd from '../../assets/images/academy-icons/cicd.png'

function HowWeProtect({ isOpen, setIsOpen }) {
  function toggleModal() {
    setIsOpen((prev) => !prev)
  }

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} style={{ maxWidth: '1100px' }}>
      <span
        onClick={toggleModal}
        className=' cursor-pointer'
        style={{ zIndex: '1' }}
      >
        <img className='left-arrow-modal' src={leftArrow} alt='left' />
      </span>
      <ModalBody>
        <div className='mt-4-4 d-flex gap-4 align-items-center flex-col-r-900 p-inl-100 p-inl-1-900'>
          <div className=''>
            <h5 className='fs-15 fw-light text-uppercase text-black lh-sm'>
              Security Measures for a<br />
              <span className='fs-24 fw-bold'>Safe and Secure Platform</span>
            </h5>
            <p className='fs-18 fw-light text-black'>
              At Learn to Start, we prioritize the security of our users and
              their data. Our e-Learning Platform integrates the power of Amazon
              Web Services (AWS) to deliver a secure and seamless online
              experience. Below, we outline the key security measures we’ve
              implemented to protect your data and ensure a safe learning
              environment.
            </p>
          </div>
          <img src={AWS} alt='aws' className='w-100' />
        </div>
        <div className='px-5 d-grid grid-col-2 gap-5 mt-5 d-flex-900 flex-col-900'>
          <div>
            <img className='w-100' src={frontS} alt='shield' />
          </div>
          <div className='align-self-end'>
            <h5 className='fs-24 fw-bold text-uppercase text-black lh-sm'>
              Frontend Security <br />
              (CloudFront, Route 53, S3)
            </h5>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>HTTPS Enforcement</span>: We’ve
              configured CloudFront to enforce HTTPS connections, ensuring all
              communication between your browser and our platform is encrypted.
              Additionally, all HTTP traffic is automatically redirected to
              HTTPS. Why it matters: Protects against man-in-the-middle attacks
              and ensures data integrity during transmission.
            </p>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>S3 Bucket Permissions</span>: All S3
              buckets are private, with public access disabled. We’ve also
              configured bucket policies to allow access only through CloudFront
              using Origin Access Identity (OAI). Why it matters: Ensures that
              sensitive files and resources are accessible only through secure
              channels, preventing unauthorized access.
            </p>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>Content Security Policy (CSP)</span>:
              We’ve implemented CSP headers to define allowed sources for
              scripts, styles, and other resources. Why it matters: Mitigates
              Cross-Site Scripting (XSS) attacks by controlling which external
              resources can be loaded on our platform.
            </p>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>DNS Security</span>: We’ve restricted
              Route 53 records with least privilege access to ensure only
              authorized users can manage DNS settings. Why it matters: Reduces
              the risk of DNS misconfigurations and unauthorized changes.
            </p>
          </div>
        </div>
        <div className='px-5 gap-5 d-grid grid-col-2 mt-5 d-flex-900 flex-col-r-900'>
          <div>
            <h5 className='fs-24 fw-bold text-uppercase text-black lh-sm'>
              Backend Security <br />
              (EC2, Node.js Application)
            </h5>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>Access Control</span>: Our EC2 instances
              are secured with IAM roles, limiting access to AWS services based
              on the principle of least privilege. Why it matters: Ensures that
              only authorized services and users can interact with our backend
              infrastructure.
            </p>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>Firewall and Network Security</span>:
              We’ve configured Security Groups to restrict inbound traffic to
              only necessary ports (e.g., 443 for HTTPS, 3306 for RDS). Why it
              matters: Minimizes the attack surface by blocking unnecessary
              ports and services.
            </p>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>Application-Level Security</span>: User
              inputs are sanitized in our Node.js application to prevent SQL
              injection and XSS attacks. Why it matters: Protects against common
              web vulnerabilities that could compromise user data or system
              integrity.
            </p>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>Patch Management</span>: We regularly
              update the operating system, Node.js, and dependencies to patch
              known vulnerabilities. Why it matters: Ensures that our systems
              are protected against the latest security threats.
            </p>
          </div>
          <img className='w-100' src={backS} alt='security' />
        </div>
        <div className='px-5 d-grid grid-col-2 gap-5 mt-5 d-flex-900 flex-col-900'>
          <div>
            <img className='w-100' src={rdsMysql} alt='rds-mysql' />
          </div>
          <div className='align-self-end'>
            <h5 className='fs-24 fw-bold text-uppercase text-black lh-sm'>
              Database Security <br />
              (RDS MySQL)
            </h5>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>Encryption</span>: We’ve enabled RDS
              encryption for data at rest and enforced SSL/TLS for connections
              to the database. Why it matters: Protects sensitive data from
              unauthorized access, both in storage and during transmission.
            </p>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>Access Control</span>: Access to the RDS
              instance is restricted via Security Groups, allowing only specific
              IPs or VPCs. Database users are configured with the principle of
              least privilege. Why it matters: Ensures that only authorized
              applications and users can access the database, minimizing the
              risk of data
            </p>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>Backup and Recovery</span>: Automated
              backups and snapshots are enabled for disaster recovery. Why it
              matters: Provides a reliable recovery mechanism in case of data
              loss or corruption.
            </p>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>Database Monitoring</span>: We use
              Amazon CloudWatch to monitor RDS performance and security, and
              Audit Logs are enabled to track database activities. Why it
              matters: Allows real-time monitoring and tracking of database
              activities for security and performance.
            </p>
          </div>
        </div>
        <div className='px-5 gap-5 d-grid grid-col-2 mt-5 d-flex-900 flex-col-r-900'>
          <div>
            <h5 className='fs-24 fw-bold text-uppercase text-black lh-sm'>
              General Security Measures
            </h5>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>IAM Policies and Roles</span>: We
              enforce the principle of least privilege for all AWS resources and
              use IAM roles for specific tasks instead of long-term access keys.
              Why it matters: Reduces the risk of unauthorized access to AWS
              resources.
            </p>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>Monitoring and Alerts</span>: We’ve
              configured AWS CloudTrail for logging API activities across our
              AWS infrastructure. Why it matters: Provides visibility into AWS
              resource usage and helps detect suspicious activities.
            </p>
          </div>
          <img className='w-100' src={generalSecurity} alt='security' />
        </div>
        <div className='px-5 d-grid grid-col-2 gap-5 mt-5 d-flex-900 flex-col-900'>
          <div>
            <img className='w-100' src={cicd} alt='rds-mysql' />
          </div>
          <div className='align-self-end'>
            <h5 className='fs-24 fw-bold text-uppercase text-black lh-sm'>
              Deployment Security
            </h5>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>CI/CD Pipelines</span>: Our deployment
              process is secured through CI/CD pipelines, ensuring that only
              tested and approved code is deployed to production. Why it
              matters: Reduces the risk of deploying vulnerable or malicious
              code.
            </p>
            <p className='fs-16 fw-light text-black'>
              <span className='fw-bold'>Docker Images</span>: We use secure and
              regularly updated Docker images for containerized deployments. Why
              it matters: Ensures that our application runs in a secure and
              isolated environment.
            </p>
          </div>
        </div>
        <div className='mt-5'>
          <h5 className='fs-24 fw-bold text-uppercase text-black lh-sm'>
            Commitment to Security
          </h5>
          <p className='fs-16 fw-light text-black'>
            At Learn to Start, we are committed to maintaining the highest
            standards of security. By leveraging the power of AWS and
            implementing industry best practices, we ensure that your data is
            protected at every step. Our platform is designed to provide you
            with a safe, secure, and seamless learning experience.
          </p>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default HowWeProtect
