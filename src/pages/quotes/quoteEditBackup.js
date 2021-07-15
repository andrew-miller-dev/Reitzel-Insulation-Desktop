Customer:
                    <input type="text" className="ant-input ant-col-8" name="first_name"
                            placeholder="First Name" defaultValue={firstName} onChange={(e) => {assignFirstName(e.target.value)}} />
                    <input type="text" className="ant-input ant-col-8" name="last_name"
                            placeholder="Last Name" defaultValue={lastName} onChange={(e) => {assignLastName(e.target.value)}} />
                    <br/>
                    Address:
                    <input type="text" className="ant-input" name="billing_address"
                            placeholder="Billing Address" defaultValue={billingAddress} onChange={(e) => {assignBillingAddress(e.target.value)}} />
                    <br/>
                    City:
                    <input type="text" className="ant-input" name="city"
                            placeholder="contractor city" defaultValue={city} onChange={(e) => {assignCity(e.target.value)}} />

                    <br/>
                    Postal Code:
                    <input type="text" className="ant-input" name="postal_code"
                            placeholder="contractor postal code" defaultValue={postCode} onChange={(e) => {assignPostCode(e.target.value)}} />
                    <br/>
                    Phone:
                    <input type="text" className="ant-input" name="phone_number"
                            placeholder="contractor phone number" defaultValue={phoneNumber} onChange={(e) => {assignPhoneNumber(e.target.value)}} />

                    <br/>
                    Email:
                    <input type="text" className="ant-input" name="email"
                            placeholder="contractor email" defaultValue={email} onChange={(e) => {assignEmail(e.target.value)}} />
                            </Card>
                        </Col>
                         <Col span={10}>
                            <Card title="Site Address" bordered={false}>
                    Address:
                    <input type="text" className="ant-input" name="site_address"
                            placeholder="Site Address" defaultValue={siteAddress} onChange={(e) => {assignSiteAddress(e.target.value)}} />
                    <br/>
                    City:
                    <input type="text" className="ant-input" name="site_city"
                            placeholder="Site City" defaultValue={siteCity} onChange={(e) => {assignSiteCity(e.target.value)}} />
                    <br/>
                    Province:
                    <input type="text" className="ant-input" name="site_prov"
                            placeholder="Site Province" defaultValue={siteProv} onChange={(e) => {assignSiteProv(e.target.value)}} />
                            < br/>
                    Postal Code:
                    <input type="text" className="ant-input" name="site_code"
                            placeholder="Site Postal Code" defaultValue={siteCode} onChange={(e) => {assignSiteCode(e.target.value)}} />