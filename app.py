from flask import Flask, render_template, jsonify, request, redirect, url_for, session
from pymongo import MongoClient
import jwt
import json
import datetime
import hashlib
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import requests
import os
from bson import ObjectId
from os.path import join, dirname
import shutil
import uuid
import random
import secrets
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)


MONGODB_URI = os.environ.get("MONGODB_URI")
DB_NAME = os.environ.get("DB_NAME")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]


app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
SECRET_KEY = "DARU"

TOKEN_KEY = "mytoken"

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/faq')
def faq():
    return render_template('faq.html')


@app.route('/produk')
def produk():
    data = list(db.produk.find({}))
    return render_template('Produk.html', data=data)


@app.route('/us')
def us():
    return render_template('us.html')


@app.route('/dampak')
def dampak():
    return render_template('dampak.html')


@app.route('/produk1')
def produk1():
    id = int(request.args.get('id'))
    data = list(db.comment.find({"id": id}, {'_id': False}))
    ratings = db.comment.find({"id": id}, {"_id": 0, "rating": 1})
    rating_values = [rating["rating"] for rating in ratings]
    total_rating = sum(rating_values)
    if len(rating_values) > 0:
        average_rating = total_rating / len(rating_values)
    else:
        average_rating = 0  # Atau nilai lain yang sesuai jika tidak ada peringkat
    total_comments = len(data)  # Menghitung jumlah komentar dalam 'data'
    return render_template('detail-Produk1.html', average_rating=average_rating, data=data, total_comments=total_comments)


@app.route('/produk2')
def produk2():
    id = int(request.args.get('id'))
    data = list(db.comment.find({"id": id}, {'_id': False}))
    ratings = db.comment.find({"id": id}, {"_id": 0, "rating": 1})
    rating_values = [rating["rating"] for rating in ratings]
    total_rating = sum(rating_values)
    if len(rating_values) > 0:
        average_rating = total_rating / len(rating_values)
    else:
        average_rating = 0  # Atau nilai lain yang sesuai jika tidak ada peringkat
    total_comments = len(data)  # Menghitung jumlah komentar dalam 'data'
    return render_template('detail-Produk2.html', average_rating=average_rating, data=data, total_comments=total_comments)


@app.route('/produk3')
def produk3():
    id = int(request.args.get('id'))
    data = list(db.comment.find({"id": id}, {'_id': False}))
    ratings = db.comment.find({"id": id}, {"_id": 0, "rating": 1})
    rating_values = [rating["rating"] for rating in ratings]
    total_rating = sum(rating_values)
    if len(rating_values) > 0:
        average_rating = total_rating / len(rating_values)
    else:
        average_rating = 0  # Atau nilai lain yang sesuai jika tidak ada peringkat
    total_comments = len(data)  # Menghitung jumlah komentar dalam 'data'
    return render_template('detail-Produk3.html', average_rating=average_rating, data=data, total_comments=total_comments)


@app.route('/produk4')
def produk4():
    id = int(request.args.get('id'))
    data = list(db.comment.find({"id": id}, {'_id': False}))
    ratings = db.comment.find({"id": id}, {"_id": 0, "rating": 1})
    rating_values = [rating["rating"] for rating in ratings]
    total_rating = sum(rating_values)
    if len(rating_values) > 0:
        average_rating = total_rating / len(rating_values)
    else:
        average_rating = 0  # Atau nilai lain yang sesuai jika tidak ada peringkat
    total_comments = len(data)  # Menghitung jumlah komentar dalam 'data'
    return render_template('detail-Produk4.html', average_rating=average_rating, data=data, total_comments=total_comments)


# def verify_password(password):
#     # Gantilah dengan logika verifikasi password yang sesuai
#     return password == 'daru'


@app.route('/login', methods=['POST', 'GET'])
def login():
    # # Menggunakan POST untuk ambil password
    # password = request.form.get('password')

    # if not verify_password(password):
    #     # Menampilkan pesan kesalahan dengan alert JavaScript
    #     return render_template('index.html', msg=None, error_message="Password salah! Anda tidak diizinkan mengakses halaman ini")

    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=['HS256']
        )

        if 'username' not in session:
            return redirect(url_for('login', msg='Please login first'))

        user_info = db.users.find_one({'username': payload.get('id')})
        return redirect(url_for('dashboard', user_info=user_info))
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        msg = request.args.get('msg')
        return render_template('login.html', msg=msg, error_message=None)


@app.route("/sign_in", methods=["POST"])
def sign_in():
    # Sign in
    username_receive = request.form["username_give"]
    password_receive = request.form["password_give"]
    pw_hash = hashlib.sha256(password_receive.encode("utf-8")).hexdigest()
    result = db.users.find_one(
        {
            "username": username_receive,
            "password": pw_hash,
        }
    )
    if result:
        payload = {
            'id': username_receive,
            "exp": datetime.utcnow() + timedelta(seconds=60 * 60 * 24),
        }
        session['username'] = username_receive
        username = session.get('username')
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return jsonify({'result': 'success', 'token': token, "username": username})
    else:
        return jsonify({
            "result": "fail",
            "msg": "We could not find a user with that id/password combination",
        })


@app.route("/save", methods=["POST"])
def sign_up():
    username_receive = request.form["username_give"]
    nama_receive = request.form["nama_give"]
    password_receive = request.form["password_give"]
    password_hash = hashlib.sha256(
        password_receive.encode("utf-8")).hexdigest()
    doc = {
        "username": username_receive,  # id
        "password": password_hash,  # password
        "nama_lengkap": nama_receive,  # user's name is set to their id by default
    }
    result = db.users.insert_one(doc)
    if result:
        payload = {
            'id': username_receive,
            "exp": datetime.utcnow() + timedelta(seconds=60 * 60 * 24),
        }
        session['username'] = username_receive
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return jsonify({'result': 'success', 'token': token})
    else:
        return jsonify({
            "result": "fail",
            "msg": "Something Wrong",
        })


@app.route("/admin", methods=["POST", "GET"])
def admin():

    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({'username': payload.get('id')})

        return render_template("admin-home.html", user_info=user_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="Your login session has expired, please log in again"))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="Please login first"))


@app.route("/admin/product", methods=["POST", "GET"])
def admin_product():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({'username': payload.get('id')})
        data = list(db.produk.find({}))
        return render_template("admin-product.html", user_info=user_info, data=data)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="Your login session has expired, please log in again"))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="Please login first"))


# bagian user


@app.route("/admin/user", methods=["POST", "GET"])
def admin_user():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({'username': payload.get('id')})
        data = list(db.users.find({}))
        return render_template("admin-user.html", user_info=user_info, data=data)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="Your login session has expired, please log in again"))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="Please login first"))


@app.route("/admin/comment")
def admin_comment():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        data = list(db.comment.find({}))
        return render_template("admin-comment.html", data=data)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="Your login session has expired, please log in again"))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="Please login first"))


@app.route("/deleteUser", methods=['GET'])
def deleteUser():
    id = request.args.get("id")
    db.users.delete_one({'_id': ObjectId(id)})
    data = db.users.find({})
    return render_template("admin-user.html", data=data)
# akhir bagian user


@app.route("/deleteComment", methods=['GET'])
def deleteComment():
    id = int(request.args.get("id"))
    db.comment.delete_one({'id': id})
    data = db.comment.find({})
    return render_template("admin-comment.html", data=data)
# akhir bagian user


@app.route("/logout")
def logout():
    session.pop('username', None)
    session.pop('name', None)
    return redirect("/")


# @app.route('/getUsers', methods=['GET'])
# def getUsers():
#     data = list(db.users.find({}))
#     return jsonify({'users': Alluser})

# untuk mengubah format rupiah


def format_rupiah(amount):
    # Ubah angka menjadi string dan tambahkan '0' di depan jika panjangnya kurang dari 3
    amount_str = str(amount).rjust(3, '0')

    # Pisahkan angka menjadi grup-grup yang terdiri dari 3 digit, mulai dari digit paling belakang
    groups = []
    while amount_str:
        groups.append(amount_str[-3:])
        amount_str = amount_str[:-3]

    # Gabungkan grup-grup dengan pemisah '.'
    formatted_amount = '.'.join(reversed(groups))
    return formatted_amount
# post card ke page produk dan dashboard produk

# random id


def generate_random_id(min_value, max_value):
    return random.randint(min_value, max_value)


@app.route('/save_product', methods=['POST'])
def save_product():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=['HS256']
        )
        user_info = db.users.find_one({'username': payload.get('id')})
        # membuat id acak
        # Membuat UUID versi 4 (ID acak)
        random_id = generate_random_id(1000, 9999)
        # buat kode input data disini
        idProduk = random_id
        pname_receive = request.form.get('pname_give')
        ppic_receive = request.files['ppic_give']
        price_receive = request.form.get('price_give')  # Ambil jenis layout
        format_price = format_rupiah(price_receive)
        desc = request.form.get('desc_give')

        # Mencari nomor folder terakhir
        last_folder = db.produk.find_one(
            sort=[('folder', -1)], projection={'folder': 1})
        if last_folder and 'folder' in last_folder:
            last_number = int(
                last_folder['folder'].replace('detailProduk', ''))
            detail = f"detailProduk{last_number + 1}"
        else:
            detail = "detailProduk1"

        directory = f'static/img/detail_product/{detail}'
        os.makedirs(directory, exist_ok=True)

        # akhir kode cari folder

        extension = ppic_receive.filename.split('.')[1]
        filename = f'{directory}/{pname_receive}.{extension}'
        ppic_receive.save(filename)

        card_ppic = f'img/detail_product/{detail}/{pname_receive}.{extension}'

        doc = {
            'idProduk': idProduk,
            'pname': pname_receive,
            'ppic': card_ppic,
            'folder': detail,
            'price': format_price,
            'desc': desc,
        }
        db.produk.insert_one(doc)
        return jsonify({'msg': 'Product added successfully', 'result': 'success'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('/login'))

# deleteProduct


@app.route("/deleteProduk", methods=['POST'])
def hapusProduk():
    id = request.form["id_give"]
    check = db.produk.find_one({'idProduk': int(id)})

    if check:
        # hapus folder
        folder_delete = check['folder']
        folder_path = os.path.join(
            'static', 'img', 'detail_product', folder_delete)

        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)

        db.produk.delete_one({'idProduk': int(id)})
        db.detail_produk.delete_many({'folder': check.get('folder')})
        return jsonify({"msg": "Produk berhasil di hapus"})
    else:
        return jsonify({"msg": "Produk tidak ditemukan"})


@app.route('/admin/fill-edit/<int:id>', methods=['GET'])
def fill_edit(id):
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=['HS256']
        )

        fill = db.produk.find_one({'idProduk': id}, {'_id': False})

        if save_product:
            return jsonify({'result': 'success', 'post': fill})
        else:
            return jsonify({'result': 'error', 'msg': 'Tambahkan Produk terlebih dahulu'}), 404

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('home'))


@app.route('/admin/prosesEdit/<int:id>', methods=['POST'])
def prosesEdit(id):
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=['HS256']
        )

        pname_receive = request.form.get('pname-give')
        price_receive = request.form.get('price-give')
        format_price = format_rupiah(price_receive)
        desc = request.form.get('desc-give')

        if "ppic_give" in request.files:
            new_image = request.files['ppic-give']

            old_post = db.produk.find_one({'idProduk': id})
            old_image_path = old_post.get('ppic')

            if new_image:
                # mengambil varialbel folder di database
                folder = db.produk.find_one({'idProduk': id}, {"folder": 1})
                # Lakukan penyimpanan file gambar yang baru
                extension = new_image.filename.split(
                    '.')[-1]  # Ambil ekstensi dengan benar
                filename = f'static/img/detail_product/{folder}/{pname_receive}.{extension}'
                new_image.save(filename)

                new_image_path = f'img/detail_product/{folder}/{pname_receive}.{extension}'
                db.produk.update_one({'idProduk': id},
                                     {'$set': {'pname': pname_receive, 'desc': desc, 'price': format_price, 'ppic': new_image_path}})

                # Hapus gambar yang lama
                if old_image_path:
                    old_image_file = os.path.join('static', old_image_path)
                    if os.path.exists(old_image_file):
                        os.remove(old_image_file)

        else:
            # Jika tidak ada file yang diunggah, tetap perbarui title dan layout
            db.produk.update_one(
                {'idProduk': id}, {'$set': {'pname': pname_receive, 'desc': desc, 'price': format_price}})

        return jsonify({'result': 'success', 'msg': 'Data produk telah diperbarui'})

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('home'))


@app.route('/produk/<folder>', methods=['GET'])
def produkdetail(folder):
    post = db.produk.find_one({'folder': folder}, {'_id': False})

    if post:
        post_id = post.get('idProduk')
        id_folder = post.get('folder')

        # Mengambil detail produk terkait
        detail = list(db.detail_produk.find(
            {'folder': id_folder}, {'_id': False}))

        data = list(db.produk.find(
            {'folder': id_folder}, {'_id': False}))

        id = int(request.args.get("id"))
        com = list(db.comment.find({"id": id}))
        ratings = db.comment.find({"id": id}, {"_id": 0, "rating": 1})
        rating_values = [rating["rating"] for rating in ratings]
        total_rating = sum(rating_values)
        if len(rating_values) > 0:
            average_rating = total_rating / len(rating_values)
        else:
            average_rating = 0  # Atau nilai lain yang sesuai jika tidak ada peringkat

        return render_template('detailProduk.html',average_rating=average_rating,com=com, data=data, post=post, detail=detail, username=session.get('username'))

    # Handle jika tidak ada post dengan folder yang diberikan
    return render_template('error.html', message='Produk tidak ditemukan')


@app.route('/tambahDetailProduk', methods=['POST'])
def tambahdetail():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=['HS256']
        )
        # Mengambil data dari form
        id = int(request.form.get('id_give'))
        produk_db = db.produk.find_one({'idProduk': id}, {'_id': False})
        judul_receive = request.form.get('judul_give')
        desc_receive = request.form.get('desc_give')
        pic1 = request.files['pic1_give']
        pic2 = request.files['pic2_give']
        pemakaian = json.loads(request.form.get('jsonData'))
        print(pemakaian)
        loc_folder = produk_db.get('folder')

        # Membuat direktori untuk menyimpan gambar
        directory = f'static/img/detail_product/{loc_folder}'
        os.makedirs(directory, exist_ok=True)

        # Menyimpan gambar 1
        extension1 = pic1.filename.split('.')[-1]
        if extension1 not in ['jpg', 'jpeg', 'png', 'gif']:
            return jsonify({'msg': 'Hanya gambar yang diizinkan', 'result': 'error'})
        filename1 = f'{directory}/{judul_receive}_pic1.{extension1}'
        pic1.save(filename1)
        dbpic1 = f'img/detail_product/{loc_folder}/{judul_receive}_pic1.{extension1}'

        # Menyimpan gambar 2
        extension2 = pic2.filename.split('.')[-1]
        if extension2 not in ['jpg', 'jpeg', 'png', 'gif']:
            return jsonify({'msg': 'Hanya gambar yang diizinkan', 'result': 'error'})
        filename2 = f'{directory}/{judul_receive}_pic2.{extension2}'
        pic2.save(filename2)
        dbpic2 = f'img/detail_product/{loc_folder}/{judul_receive}_pic2.{extension2}'

        # Menyimpan data dalam basis data
        doc = {
            "idProduk": id,
            'title': judul_receive,
            'desc': desc_receive,
            'pic1': dbpic1,
            'pic2': dbpic2,
            'penggunaan': pemakaian,
            'folder': produk_db.get('folder'),
        }
        db.detail_produk.insert_one(doc)

        return jsonify({'msg': 'Data telah ditambahkan', 'result': 'success'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('home'))


@app.route("/tambahkomen", methods=["POST"])
def tambahkomen():
    rating = int(request.form['rating_give'])
    date = request.form['date_give']
    id = int(request.form['id_give'])
    nama = request.form['nama_give']
    head = request.form['head_give']
    isi = request.form['isi_give']

    doc = {
        "id": id,
        "rating": rating,
        "netizen": nama,
        "head": head,
        "isi": isi,
        "date": date,
    }
    db.comment.insert_one(doc)
    return jsonify({"msg": "Ulasan anda berhail ditambahakan", "result": "success"})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
