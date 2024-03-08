from datetime import timedelta
from flask import Flask,render_template, request, jsonify, session, make_response, redirect, url_for
import mysql.connector
from functools import wraps



app = Flask(__name__)
app.secret_key = '6969@itachi'
#app.permanent_session_lifetime = timedelta(days=1)  # Session expires in a day

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '6969itachi',
    'database': 'spaceexploration'
}

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function

# # Before each request, check if the user is authenticated
# @app.before_request
# def check_authentication():
#     if request.endpoint != 'index':  # Check if the user is not accessing the root page
#         if 'user_id' not in session:  # Check if the user is not authenticated
#             return redirect('/')  # Redirect them to the root page



# function to fetch data for filter dropdown
def get_distinct_values(col_name, table_name):
    query = f"SELECT DISTINCT {col_name} FROM {table_name};"
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    cursor.execute(query)
    values = [result[0] for result in cursor.fetchall()]
    cursor.close()
    connection.close()
    return values





# function to fetch distinct year for filter dropdown
def get_distinct_years(col_name, table_name):
    query = f"SELECT DISTINCT YEAR({col_name}) FROM {table_name};"
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    cursor.execute(query)
    years = [result[0] for result in cursor.fetchall()]
    cursor.close()
    connection.close()
    return years



# function to fetch content details
def get_details(table_name, col_name, id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    query = f"SELECT * FROM {table_name} WHERE {col_name}={id}"
    # print(query)
    cursor.execute(query)
    # print(query)
    content = cursor.fetchall()
    # print(content)
    cursor.close()
    connection.close()

    return content[0]


# login and sing up page
@app.route('/')
def index():
    return render_template('signupAndlogin.html')





# sign up API call
@app.route('/signup', methods=['POST'])
def signup():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    query = f"SELECT * FROM USERS WHERE EMAIL = '{email}'"
    cursor.execute(query)
    result = cursor.fetchall()
    # print(result)


    if not result:
        query = f"INSERT INTO USERS(USERNAME, EMAIL, PASSWORD) VALUES('{username}','{email}','{password}')"
        cursor.execute(query)
        connection.commit()  # to commit the transaction after changes
        query1 = f"SELECT USER_ID FROM USERS WHERE EMAIL = '{email}'"
        cursor.execute(query1)
        result = cursor.fetchall()
        cursor.close()
        connection.close()
        session['user_id'] = result[0]['USER_ID']
        return jsonify({'success': True, 'message': 'Signup successful!'}), 200
    
    else:
        cursor.close()
        connection.close()
        return jsonify({'success': False, 'message':'Email id already exists please Log In..'}), 500
    
    





# log in API call
@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    query = f"SELECT * FROM USERS WHERE EMAIL = '{email}' AND PASSWORD = '{password}';"
    cursor.execute(query)
    result = cursor.fetchall()
    # print(result)

    if result:
        cursor.close()
        connection.close()
        session['user_id'] = result[0]['user_id']
        return jsonify({'success': True, 'message': 'Succesfully logged in. Welcome!'}), 200
    

    else:
        cursor.close()
        connection.close()
        return jsonify({'success': False, 'message': 'Please enter the correct email or password.'}), 500
    





# to clear the session or logout the user
@app.route('/logout')
def logout():
    session.clear()

    # Delete the session cookie
    response = make_response(redirect(url_for('index')))
    response.delete_cookie('session')
    return response



# to update username
@app.route('/update_username', methods=['POST'])
def update_username():
    newUsername = request.form.get('newUsername')

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    query = f"SELECT USERNAME FROM USERS WHERE USER_ID={session['user_id']}"
    cursor.execute(query)
    username = cursor.fetchall()[0]['USERNAME']
    # print(username)
    update = f"""
                UPDATE USERS
                SET USERNAME='{newUsername}'
                WHERE USER_ID={session['user_id']};"""
    # print(update)
    cursor.execute(update)
    connection.commit()
    cursor.close()
    connection.close()

    return jsonify({'success': True}), 200



# to check session
@app.route('/check_session')
def check_session():
    if 'user_id' in session:
        user_id = session['user_id']
        return f"Session user_id: {user_id}"
    else:
        return "No session"






# Home page routing
@app.route('/home')
@login_required
def home():
    # Execute sql query for recent 5 missions
    query_recent = "SELECT * FROM MISSIONS ORDER BY LAUNCH_DATE DESC LIMIT 5;"
    
    # Connect to MySQL using the provided configuration
    connection = mysql.connector.connect(**db_config)

    # ROW COUNT
    # Call Procedure to get row count
    cursor = connection.cursor()

    # call procedure
    table_names =['missions', 'rovers', 'astronauts', 'milestones']
    row_counts = []
    for table_name in table_names:
        result_args = cursor.callproc('GetRowCount', ( table_name, 0))
        # get rowcount
        row_counts.append(result_args[1])

    # Execute the query
    cursor = connection.cursor(dictionary=True)
    cursor.execute(query_recent)

    # Fetch the results
    recent_missions = cursor.fetchall()

    # Close the cursor and connection
    cursor.close()
    connection.close()

    return render_template('home.html', recent_missions=recent_missions, row_counts=row_counts)




# missions routing
@app.route('/missions')
@login_required
def missions():
    # call get_distinct_values
    agencies = get_distinct_values('agency', 'MISSIONS')
    target_cb = get_distinct_values('target_celestial_body', 'MISSIONS')
    status = get_distinct_values('status', 'MISSIONS')
    year = get_distinct_years('launch_date', 'MISSIONS')

    return render_template('missions.html', agencies=agencies, target_cb=target_cb, status=status, year=year)




# get_missions API call
@app.route('/get_missions', methods=['POST'])
def get_missions():
    MISSIONS_PER_PAGE = 5

    # get filters from request
    agency_filter = request.form.get('agency')
    target_filter = request.form.get('target')
    status_filter = request.form.get('status')
    year_filter = request.form.get('year')
    # print(agency_filter)
    # print(target_filter)
    # print(status_filter)
    # print(year_filter)

    # Calculate offset based on the page number
    page = int(request.form.get('page', 1))
    # print(page)
    offset = (page - 1) * MISSIONS_PER_PAGE
    # print(offset)

    # connection
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    where = "WHERE 1=1"
    params = []

    # add filters to query
    if agency_filter:
        if agency_filter != 'none':
            where += " AND AGENCY = %s"
            params.append(agency_filter)
    
    if target_filter:
        if target_filter != 'none':
            where += " AND TARGET_CELESTIAL_BODY = %s"
            params.append(target_filter)
    
    if status_filter:
        if status_filter != 'none':
            where += " AND STATUS = %s"
            params.append(status_filter)

    if year_filter:
        if year_filter != 'none':
            where+= " AND YEAR(LAUNCH_DATE) = %s"
            params.append(year_filter)

    query = f"SELECT * FROM MISSIONS {where} LIMIT %s OFFSET %s"   
    params.extend([MISSIONS_PER_PAGE,offset])
    # print(query)

    cursor.execute(query, tuple(params))
    missions = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify({'missions':missions})




# mission_details routing 
@app.route('/mission_details/<mission_id>')
@login_required
def mission_details(mission_id):
    content_m = get_details('MISSIONS', 'MISSION_ID', mission_id)
    return render_template('mission_details.html', content_m=content_m)




# function to check bookmarks for all types of bookmarks
def checkBookmark(type, col_name, id):

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    query = f"SELECT * FROM {type}_BOOKMARK WHERE USER_ID={session['user_id']} AND {col_name}={id}"
    cursor.execute(query)
    # print(query)
    result = cursor.fetchall()
    cursor.close()
    connection.close()

    return result



# mission_details routing for bookmarks check
@app.route('/check_bookmark', methods=['GET'])
def check_mission_bookmark():

    id = request.args.get('id')
    type = request.args.get('type')

    result = ''

    if type == 'missions':
        result = checkBookmark(type.upper(), 'MISSION_ID', id)
    elif type == 'rovers':
        result = checkBookmark(type.upper(), 'ROVER_ID', id)
    elif type == 'astronauts':
        result = checkBookmark(type.upper(), 'ASTRONAUT_ID', id)

    if result:
        return jsonify({'success': True, 'is_bookmarked': True}), 200
    else:
        return jsonify({'success': True, 'is_bookmarked': False}), 200
    



# function for inserting bookmark for all types of bookmarks
def insertBookmark(type, col_name, id):

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    query = f"INSERT INTO {type}_BOOKMARK(user_id,{col_name}) VALUES ({session['user_id']}, {id})"
    # print(query)
    cursor.execute(query)
    connection.commit()
    cursor.close()
    connection.close()

    return True

# function for deleting bookmark for all types of booomarks
def deleteBookmark(type, col_name, id):

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    query = f"DELETE FROM {type}_BOOKMARK WHERE user_id = {session['user_id']} AND {col_name} = {id}"
    cursor.execute(query)
    connection.commit()
    cursor.close()
    connection.close()

    return True





# routing for insert or delete of missions bookmark
@app.route('/bookmark', methods=['POST'])
def bookmark():

    id = request.form.get('id')
    isChecked = request.form.get('isChecked')
    type = request.form.get('type')
    # print(type)
    # print(isChecked)

    success = ''

    if isChecked == 'true':
        if type == 'missions':
            success = insertBookmark(type.upper(), 'MISSION_ID', id)
            # print(success)
        elif type == 'rovers':
            success = insertBookmark(type.upper(), 'ROVER_ID', id)
        elif type == 'astronauts':
            success = insertBookmark(type.upper(), 'ASTRONAUT_ID', id)
        return jsonify({'success': success})
    
    else:
        if type == 'missions':
            success = deleteBookmark(type.upper(), 'MISSION_ID', id)
        elif type == 'rovers':
            success = deleteBookmark(type.upper(), 'ROVER_ID', id)
        elif type == 'astronauts':
            success = deleteBookmark(type.upper(), 'ASTRONAUT_ID', id)
        return jsonify({'success': success})
    



# /rovers routing
@app.route('/rovers')
@login_required
def rovers():
    # call get_ditinct_values
    agencies = get_distinct_values('AGENCY', 'MISSION_ROVER_V')
    status = get_distinct_values('STATUS', 'MISSION_ROVER_V')
    destinations = get_distinct_values('TARGET_CELESTIAL_BODY', 'MISSION_ROVER_V')
    years = get_distinct_years('landing_date', 'MISSION_ROVER_V')

    return render_template('rovers.html', agencies=agencies, status=status, destinations=destinations,years=years)


# /get_rovers API routing
@app.route('/get_rovers', methods=['POST'])
def get_rovers():
    ROVERS_PER_PAGE = 5

    #get filters from request
    agency_filter = request.form.get('agency')
    destination_filter = request.form.get('destination')
    status_filter = request.form.get('status')
    year_filter = request.form.get('year')

    # Calculate offset based on the page number
    page = int(request.form.get('page',1))
    # print(page)
    offset = (page - 1) * ROVERS_PER_PAGE
    # print(offset)

    #connection
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    where = "WHERE 1=1"
    params = []

    # add filters to query
    if agency_filter:
        if agency_filter != 'none':
            where += " AND AGENCY = %s"
            params.append(agency_filter)
    
    if destination_filter:
        if destination_filter != 'none':
            where += " AND TARGET_CELESTIAL_BODY = %s"
            params.append(destination_filter)
    
    if status_filter:
        if status_filter != 'none':
            where += " AND STATUS = %s"
            params.append(status_filter)
    
    if year_filter:
        if year_filter != 'none':
            where += " AND YEAR(LANDING_DATE) = %s"
            params.append(year_filter)
    
    query = f"SELECT * FROM MISSION_ROVER_V {where} LIMIT %s OFFSET %s"
    params.extend([ROVERS_PER_PAGE,offset])
    # print(query)

    cursor.execute(query, tuple(params))
    rovers = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify({'rovers':rovers})




# rover_details routing
@app.route('/rover_details/<rover_id>')
@login_required
def rover_details(rover_id):
    content_r = get_details('MISSION_ROVER_DV', 'ROVER_ID', rover_id)
    return render_template('rover_details.html', content_r=content_r)





@app.route('/astronauts')
@login_required
def astronauts():
    # call get_distinct_values
    nationalities = get_distinct_values('NATIONALITY', 'ASTRONAUTS')
    missions = get_distinct_values('MISSIONS_PARTICIPATED', 'ASTRONAUTS')
    years = get_distinct_years('born_date', 'ASTRONAUTS')

    return render_template('astronauts.html', nationalities=nationalities, missions=missions, years=years)




# /get_astronauts API routing
@app.route('/get_astronauts', methods=['POST'])
def get_astronauts():
    ASTRONAUTS_PER_PAGE = 8

    #get filters from request
    nationality_filter = request.form.get('nationality')
    mission_filter = request.form.get('mission')
    year_filter = request.form.get('year')
    # print(nationality_filter)
    # print(mission_filter)
    # print(year_filter)

    #calculate offset based on the page number
    page = int(request.form.get('page',1))
    # print(page)
    offset = (page - 1) *ASTRONAUTS_PER_PAGE
    # print(offset)

    #connection
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    where = "WHERE 1=1"
    params = []

    # add filter to query
    if nationality_filter:
        if nationality_filter != 'none':
            where += " AND NATIONALITY = %s"
            params.append(nationality_filter)
    
    if mission_filter:
        if mission_filter != 'none':
            where += " AND MISSIONS_PARTICIPATED = %s"
            params.append(mission_filter)

    if year_filter:
        if year_filter != 'none':
            where += " AND YEAR(BORN_DATE) =%s"
            params.append(year_filter)

    query = f"SELECT astronaut_id, name, born_date, nationality, time_in_space, missions_participated, img_url FROM ASTRONAUTS {where} LIMIT %s OFFSET %s"
    params.extend([ASTRONAUTS_PER_PAGE,offset])
    # print(query)

    cursor.execute(query, tuple(params))
    astronauts = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify({'astronauts':astronauts})



# /astronaut_details routing
@app.route('/astronaut_details/<astronaut_id>')
@login_required
def astronaut_details(astronaut_id):
    content_a = get_details('ASTRONAUTS', 'ASTRONAUT_ID', astronaut_id)
    if 'died_date' in content_a and content_a['died_date'] is None:
        content_a['died_date'] = 'Still Alive'

    return render_template('astronaut_details.html', content_a=content_a)




# milestones routing
@app.route('/milestones')
@login_required
def milestones():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM MILESTONES_V ORDER BY DATE;"
    cursor.execute(query)
    milestones = cursor.fetchall()
    # print(milestones[0])
    cursor.close()
    connection.close()

    # mission name split on ':' and rover's 
    for milestone in milestones:
        name_split = milestone['MISSION_NAME'].split(':')
        milestone['MISSION_NAME'] = name_split[0]

    years = get_distinct_years('date', 'MILESTONES_V')

    return render_template('milestones.html', milestones=milestones, years=years)





# profile routing
@app.route('/profile')
@login_required
def profile():

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # bookmark counts query
    query = f"""
            SELECT COUNT(DISTINCT M.MISSION_ID) AS COUNT_M, COUNT(DISTINCT R.ROVER_ID) AS COUNT_R, COUNT(DISTINCT A.ASTRONAUT_ID) AS COUNT_A
            FROM MISSIONS_BOOKMARK M
            LEFT JOIN ROVERS_BOOKMARK R ON M.USER_ID = R.USER_ID
            LEFT JOIN ASTRONAUTS_BOOKMARK A ON M.USER_ID = A.USER_ID
            WHERE M.USER_ID = {session['user_id']};
    """

    cursor.execute(query)
    counts = cursor.fetchall()[0]
    counts = list(counts)
    total_count = counts[0] + counts[1] + counts[2]
    # print(counts)
    # print(total_count)

    # user details query
    query = f"SELECT USERNAME, EMAIL FROM USERS WHERE USER_ID = {session['user_id']}"
    cursor.execute(query)
    user_details = cursor.fetchall()[0]
    user_details = list(user_details)
    # print(user_details)

    cursor.close()
    connection.close()


    return render_template('profile.html', counts=counts, user_details=user_details, total_count=total_count)




# mission boomarks routing
@app.route('/mission_bookmarks')
@login_required
def mission_bookmarks():

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    query = f"""
            SELECT M.*
            FROM MISSIONS_BOOKMARK MB
            JOIN MISSIONS M ON MB.MISSION_ID = M.MISSION_ID
            WHERE MB.USER_ID = {session['user_id']}
    """
    cursor.execute(query)
    missions = cursor.fetchall()
    cursor.close()
    connection.close()

    return render_template('mission_bookmarks.html', missions=missions)





# rover bookmarks routing
@app.route('/rover_bookmarks')
@login_required
def rover_bookmarks():

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    query = f"""
            SELECT R.*
            FROM ROVERS_BOOKMARK RB
            JOIN MISSION_ROVER_V R ON RB.ROVER_ID = R.ROVER_ID
            WHERE RB.USER_ID = {session['user_id']}
    """
    cursor.execute(query)
    rovers = cursor.fetchall()
    cursor.close()
    connection.close()

    return render_template('rover_bookmarks.html', rovers=rovers)





# astronaut bookmarks routing
@app.route('/astronaut_bookmarks')
@login_required
def astronaut_bookmarks():

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    query = f"""
            SELECT A.astronaut_id, A.name, A.born_date, A.nationality, A.time_in_space, A.missions_participated, A.img_url
            FROM ASTRONAUTS_BOOKMARK AB
            JOIN ASTRONAUTS A ON AB.ASTRONAUT_ID = A.ASTRONAUT_ID
            WHERE AB.USER_ID = {session['user_id']}
    """
    cursor.execute(query)
    astronauts = cursor.fetchall()
    cursor.close()
    connection.close()

    return render_template('astronaut_bookmarks.html', astronauts=astronauts)





if __name__ == "__main__":
    app.run(debug=True)